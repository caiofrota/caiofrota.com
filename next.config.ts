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
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
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
