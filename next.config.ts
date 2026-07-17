import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const r2RemotePattern = mediaRemotePattern(process.env.R2_PUBLIC_BASE_URL);

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: r2RemotePattern ? [r2RemotePattern] : [],
  },
};

export default nextConfig;

function mediaRemotePattern(value?: string): RemotePattern | undefined {
  if (!value) return undefined;

  const normalized = value.trim();
  if (!normalized) return undefined;
  const hasProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(normalized);
  const candidate = hasProtocol ? normalized : `https://${normalized}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    if (!url.hostname || url.username || url.password || url.search || url.hash) return undefined;
    if (!hasProtocol && !url.hostname.includes(".") && url.hostname !== "localhost") return undefined;
    const basePath = url.pathname.replace(/\/$/, "");
    return {
      protocol: url.protocol === "https:" ? "https" : "http",
      hostname: url.hostname,
      port: url.port,
      pathname: `${basePath}/**`,
    };
  } catch {
    return undefined;
  }
}
