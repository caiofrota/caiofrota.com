import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const LOCAL_MEDIA_PROVIDER = "local";
export const REMOTE_MEDIA_PROVIDER = "s3";

type MediaReference = {
  id?: string;
  key: string;
  provider: string;
};

const localUploadRoot = resolve(process.cwd(), ".data", "uploads");
const remotePublicBaseUrl = validRemoteBaseUrl(env.R2_PUBLIC_BASE_URL);

export function isRemoteMediaStorageConfigured() {
  return Boolean(env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET && remotePublicBaseUrl);
}

export function publicMediaUrl(media?: MediaReference | null) {
  if (!media) return undefined;

  if (media.provider === LOCAL_MEDIA_PROVIDER) {
    return "id" in media && typeof media.id === "string" ? `/api/media/${encodeURIComponent(media.id)}` : undefined;
  }

  if (media.provider !== REMOTE_MEDIA_PROVIDER || !remotePublicBaseUrl) return undefined;
  return `${remotePublicBaseUrl}/${encodeStorageKey(media.key)}`;
}

export async function uploadMedia(file: File, key: string) {
  const safeKey = safeStorageKey(key);
  const body = Buffer.from(await file.arrayBuffer());

  if (isRemoteMediaStorageConfigured()) {
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID!,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      },
    });
    await client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET!,
        Key: safeKey,
        Body: body,
        ContentType: file.type,
      }),
    );

    return { key: safeKey, provider: REMOTE_MEDIA_PROVIDER };
  }

  const target = localMediaFilePath(safeKey);

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body, { flag: "wx" });

  return { key: safeKey, provider: LOCAL_MEDIA_PROVIDER };
}

export function localMediaFilePath(key: string) {
  const target = resolve(localUploadRoot, safeStorageKey(key));
  if (target !== localUploadRoot && !target.startsWith(`${localUploadRoot}${sep}`)) {
    throw new Error("Caminho de upload local inválido.");
  }
  return target;
}

function safeStorageKey(key: string) {
  const segments = key.replaceAll("\\", "/").split("/");
  if (!key || key.startsWith("/") || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error("Chave de upload inválida.");
  }
  return segments.join("/");
}

function encodeStorageKey(key: string) {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function validRemoteBaseUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return value.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}
