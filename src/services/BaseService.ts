import api from "../api";
import type { AxiosResponse } from "axios";

/**
 * Generic Base Service for CRUD operations
 * All entity-specific services should extend this class
 */
export class BaseService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Get all entities
   * @param params Optional query parameters
   */
  async getAll(params?: Record<string, unknown>): Promise<T[]> {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";
    const response: AxiosResponse<T[]> = await api.get(
      `${this.endpoint}${queryString}`
    );
    return response.data;
  }

  /**
   * Get entity by ID
   * @param id Entity ID
   */
  async getById(id: string): Promise<T> {
    const response: AxiosResponse<T> = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Create new entity
   * @param data Entity data
   */
  async create(data: TCreate): Promise<T> {
    const response: AxiosResponse<T> = await api.post(this.endpoint, data);
    return response.data;
  }

  /**
   * Update existing entity
   * @param id Entity ID
   * @param data Updated entity data
   */
  async update(id: string, data: TUpdate): Promise<T> {
    const response: AxiosResponse<T> = await api.put(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete entity
   * @param id Entity ID
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Custom GET request
   * @param path Additional path after endpoint
   * @param params Query parameters
   */
  protected async customGet<TResponse = unknown>(
    path: string = "",
    params?: Record<string, unknown>
  ): Promise<TResponse> {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";
    const response: AxiosResponse<TResponse> = await api.get(
      `${this.endpoint}${path}${queryString}`
    );
    return response.data;
  }

  /**
   * Custom POST request
   * @param path Additional path after endpoint
   * @param data Request body
   */
  protected async customPost<TResponse = unknown>(
    path: string = "",
    data?: unknown
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await api.post(
      `${this.endpoint}${path}`,
      data
    );
    return response.data;
  }

  /**
   * Custom PUT request
   * @param path Additional path after endpoint
   * @param data Request body
   */
  protected async customPut<TResponse = unknown>(
    path: string = "",
    data?: unknown
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await api.put(
      `${this.endpoint}${path}`,
      data
    );
    return response.data;
  }

  /**
   * Custom DELETE request
   * @param path Additional path after endpoint
   */
  protected async customDelete<TResponse = unknown>(
    path: string = ""
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await api.delete(
      `${this.endpoint}${path}`
    );
    return response.data;
  }
}
