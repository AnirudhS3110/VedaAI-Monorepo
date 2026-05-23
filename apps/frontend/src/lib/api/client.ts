import axios, { type AxiosError } from "axios";
import { env } from "@/config/env";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { ApiRequestError } from "@/types/api";
import { getApiUserId } from "./auth-headers";

export const apiClient = axios.create({
  baseURL: env.apiBasePath,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
  const userId = getApiUserId();
  if (userId) {
    config.headers.set("X-User-Id", userId);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const apiError = error.response?.data;

    if (apiError && apiError.success === false) {
      throw new ApiRequestError(
        apiError.error.message,
        apiError.error.statusCode,
        apiError.error.details,
      );
    }

    throw new ApiRequestError(
      error.message || "Request failed",
      error.response?.status ?? 500,
    );
  },
);

export async function apiGet<T>(url: string): Promise<T> {
  const { data } = await apiClient.get<ApiSuccessResponse<T>>(url);
  return data.data;
}

export async function apiPost<T, B = unknown>(
  url: string,
  body?: B,
): Promise<T> {
  const { data } = await apiClient.post<ApiSuccessResponse<T>>(url, body);
  return data.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const { data } = await apiClient.delete<ApiSuccessResponse<T>>(url);
  return data.data;
}
