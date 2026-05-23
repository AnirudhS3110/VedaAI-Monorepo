let apiUserId: string | null = null;

export function setApiUserId(userId: string | null): void {
  apiUserId = userId;
}

export function getApiUserId(): string | null {
  return apiUserId;
}
