import api from "../api";

export interface Organization {
  id: string;
  name: string;
  code: string;
  baseCurrencyCode?: string;
  baseCurrencyId?: string;
  country?: string;
  timeZone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

class OrganizationService {
  private readonly baseUrl = "/organizations";

  async getAll(): Promise<Organization[]> {
    const response = await api.get<Organization[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: string): Promise<Organization> {
    const response = await api.get<Organization>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(org: Partial<Organization>): Promise<Organization> {
    const response = await api.post<Organization>(this.baseUrl, org);
    return response.data;
  }

  async update(id: string, org: Partial<Organization>): Promise<void> {
    await api.put(`${this.baseUrl}/${id}`, { ...org, id });
  }
}

export const organizationService = new OrganizationService();
