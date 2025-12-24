import { BaseService } from "./BaseService";
import type { Client, CreateClientDto, UpdateClientDto } from "../types/client";

/**
 * Client Service
 * Handles all client-related API operations
 */
class ClientService extends BaseService<
  Client,
  CreateClientDto,
  UpdateClientDto
> {
  constructor() {
    super("/clients");
  }

  /**
   * Get all active clients
   */
  async getActive(): Promise<Client[]> {
    return this.getAll({ activeOnly: "true" });
  }

  /**
   * Search clients by name or email
   * @param query Search query
   */
  async search(query: string): Promise<Client[]> {
    return this.customGet("", { search: query });
  }
}

// Export singleton instance
export const clientService = new ClientService();
export default clientService;
