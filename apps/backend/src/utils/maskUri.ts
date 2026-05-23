export const maskConnectionUri = (uri: string): string => {
  try {
    const url = new URL(uri);
    if (url.password) {
      url.password = '****';
    }
    return url.toString();
  } catch {
    return '[redacted]';
  }
};
