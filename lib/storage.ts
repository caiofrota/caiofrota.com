import "server-only";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const LOCAL_MEDIA_PROVIDER = "local";
export const REMOTE_MEDIA_PROVIDER = "s3";

const remoteMediaVariableNames = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_BASE_URL"] as const;

type RemoteMediaVariableName = (typeof remoteMediaVariableNames)[number];

export type RemoteMediaStorageStatus = {
  state: "local" | "incomplete" | "ready";
  missingVariables: RemoteMediaVariableName[];
  invalidVariables: RemoteMediaVariableName[];
};

type MediaReference = {
  id?: string;
  key: string;
  provider: string;
};

const localUploadRoot = resolve(process.cwd(), ".data", "uploads");
const remoteEnvironment = {
  R2_ACCOUNT_ID: configuredValue(env.R2_ACCOUNT_ID),
  R2_ACCESS_KEY_ID: configuredValue(env.R2_ACCESS_KEY_ID),
  R2_SECRET_ACCESS_KEY: configuredValue(env.R2_SECRET_ACCESS_KEY),
  R2_BUCKET: configuredValue(env.R2_BUCKET),
  R2_PUBLIC_BASE_URL: configuredValue(env.R2_PUBLIC_BASE_URL),
};
const remotePublicBaseUrl = validRemoteBaseUrl(remoteEnvironment.R2_PUBLIC_BASE_URL);
const remoteMediaStorageStatus = inspectRemoteMediaStorage();

const remoteMediaConfig =
  remoteMediaStorageStatus.state === "ready"
    ? {
        accountId: remoteEnvironment.R2_ACCOUNT_ID!,
        accessKeyId: remoteEnvironment.R2_ACCESS_KEY_ID!,
        secretAccessKey: remoteEnvironment.R2_SECRET_ACCESS_KEY!,
        bucket: remoteEnvironment.R2_BUCKET!,
      }
    : undefined;

export function getRemoteMediaStorageStatus(): RemoteMediaStorageStatus {
  return {
    state: remoteMediaStorageStatus.state,
    missingVariables: [...remoteMediaStorageStatus.missingVariables],
    invalidVariables: [...remoteMediaStorageStatus.invalidVariables],
  };
}

export function isRemoteMediaStorageConfigured() {
  return Boolean(remoteMediaConfig);
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

  if (remoteMediaConfig) {
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${remoteMediaConfig.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: remoteMediaConfig.accessKeyId,
        secretAccessKey: remoteMediaConfig.secretAccessKey,
      },
    });
    await client.send(
      new PutObjectCommand({
        Bucket: remoteMediaConfig.bucket,
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

export async function removeStoredMedia(media: Pick<MediaReference, "key" | "provider">) {
  const safeKey = safeStorageKey(media.key);

  if (media.provider === REMOTE_MEDIA_PROVIDER) {
    if (!remoteMediaConfig) throw new Error("Armazenamento remoto não configurado.");
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${remoteMediaConfig.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: remoteMediaConfig.accessKeyId,
        secretAccessKey: remoteMediaConfig.secretAccessKey,
      },
    });
    await client.send(new DeleteObjectCommand({ Bucket: remoteMediaConfig.bucket, Key: safeKey }));
    return;
  }

  if (media.provider !== LOCAL_MEDIA_PROVIDER) throw new Error("Provedor de mídia inválido.");
  try {
    await unlink(localMediaFilePath(safeKey));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
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

function inspectRemoteMediaStorage(): RemoteMediaStorageStatus {
  const configuredVariables = remoteMediaVariableNames.filter((name) => remoteEnvironment[name]);
  if (configuredVariables.length === 0) {
    return { state: "local", missingVariables: [...remoteMediaVariableNames], invalidVariables: [] };
  }

  const missingVariables = remoteMediaVariableNames.filter((name) => !remoteEnvironment[name]);
  const invalidVariables: RemoteMediaVariableName[] =
    remoteEnvironment.R2_PUBLIC_BASE_URL && !remotePublicBaseUrl ? ["R2_PUBLIC_BASE_URL"] : [];

  return {
    state: missingVariables.length === 0 && invalidVariables.length === 0 ? "ready" : "incomplete",
    missingVariables,
    invalidVariables,
  };
}

function configuredValue(value?: string) {
  const normalized = value?.trim();
  return normalized || undefined;
}

function validRemoteBaseUrl(value?: string) {
  if (!value) return undefined;

  const hasProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(value);
  const candidate = hasProtocol ? value : `https://${value}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    if (!url.hostname || url.username || url.password || url.search || url.hash) return undefined;
    if (!hasProtocol && !url.hostname.includes(".") && url.hostname !== "localhost") return undefined;
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}
