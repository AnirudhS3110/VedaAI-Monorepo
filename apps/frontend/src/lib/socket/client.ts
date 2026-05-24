import { io, type Socket } from "socket.io-client";
import { getSocketTransports } from "@/lib/browser-compat";
import { env } from "@/config/env";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.socketUrl, {
      autoConnect: false,
      transports: getSocketTransports(),
      upgrade: true,
      rememberUpgrade: false,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20_000,
      withCredentials: true,
    });
  }

  return socket;
}

export function connectSocket(): Promise<void> {
  const s = getSocket();

  if (s.connected) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Socket connection timed out"));
    }, 25_000);

    const onConnect = () => {
      cleanup();
      resolve();
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      window.clearTimeout(timeout);
      s.off("connect", onConnect);
      s.off("connect_error", onError);
    };

    s.once("connect", onConnect);
    s.once("connect_error", onError);
    s.connect();
  });
}

export function reconnectSocket(): void {
  const s = getSocket();
  if (s.connected) {
    s.disconnect();
  }
  s.connect();
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
