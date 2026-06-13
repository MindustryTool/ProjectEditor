import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { API_BASE_URL } from "@project/config";
import { ApiError } from "./errors";
type RequestOptions = {
	signal?: AbortSignal;
};

type TokenProvider = () => string | undefined;

export class MindustryApiClient {
	private instance: AxiosInstance;
	private getToken: TokenProvider;

	constructor(getToken?: TokenProvider) {
		this.getToken = getToken ?? (() => undefined);

		this.instance = axios.create({
			baseURL: API_BASE_URL,
			timeout: 30_000,
			headers: {
				Accept: "application/json",
			},
		});

		this.instance.interceptors.request.use((config) => {
			const token = this.getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		this.instance.interceptors.response.use(
			(response: AxiosResponse) => response,
			(error: unknown) => {
				if (axios.isAxiosError(error)) {
					const status = error.response?.status ?? 0;
					const message = (error.response?.data as { error?: string })?.error ?? error.message ?? "Unknown error";
					const details = error.response?.data;
					return Promise.reject(new ApiError(status, message, details));
				}
				return Promise.reject(new ApiError(0, "An unexpected error occurred"));
			},
		);
	}

	getSchematicPreview(buffer: ArrayBuffer){
		const formData = new FormData();
		formData.append("data", new Blob([buffer]));

		return this.instance.post<Uint8Array>("/schematics/image", formData, { responseType: "arraybuffer" });
	}

	getMapPreview(buffer: ArrayBuffer){
		const formData = new FormData();
		formData.append("data", new Blob([buffer]));

		return this.instance.post<Uint8Array>("/maps/image", formData, { responseType: "arraybuffer" });
	}

	async get<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
		const config: AxiosRequestConfig = {};
		if (options?.signal) config.signal = options.signal;
		const response = await this.instance.get<TResponse>(path, config);
		return response.data;
	}

	async post<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions): Promise<TResponse> {
		const config: AxiosRequestConfig = {};
		if (options?.signal) config.signal = options.signal;
		const response = await this.instance.post<TResponse>(path, body, config);
		return response.data;
	}

	async put<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions): Promise<TResponse> {
		const config: AxiosRequestConfig = {};
		if (options?.signal) config.signal = options.signal;
		const response = await this.instance.put<TResponse>(path, body, config);
		return response.data;
	}

	async delete<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
		const config: AxiosRequestConfig = {};
		if (options?.signal) config.signal = options.signal;
		const response = await this.instance.delete<TResponse>(path, config);
		return response.data;
	}
}
