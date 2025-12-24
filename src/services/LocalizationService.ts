import { BaseService } from "./BaseService";
import type {
  Country,
  CreateCountryDto,
  UpdateCountryDto,
  State,
} from "../types";

class CountryService extends BaseService<
  Country,
  CreateCountryDto,
  UpdateCountryDto
> {
  constructor() {
    super("/countries");
  }

  async getActive(): Promise<Country[]> {
    return this.getAll({ activeOnly: true });
  }

  async getStates(countryId: string): Promise<State[]> {
    return this.customGet(`/${countryId}/states`);
  }
}

class StateService {
  async getByCountry(countryId: string): Promise<State[]> {
    return countryService.getStates(countryId);
  }
}

export const countryService = new CountryService();
export const stateService = new StateService();
