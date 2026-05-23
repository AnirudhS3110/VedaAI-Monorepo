const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? apiUrl;

export const env = {
  apiUrl,
  apiBasePath: `${apiUrl}/api`,
  socketUrl,
} as const;
