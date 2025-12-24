import { BaseService } from "./BaseService";
import type { Holiday, CreateHolidayDto, UpdateHolidayDto } from "../types";

class HolidayService extends BaseService<
  Holiday,
  CreateHolidayDto,
  UpdateHolidayDto
> {
  constructor() {
    super("/holidays");
  }

  async getByFilters(filters: {
    financialYearId?: string;
    countryId?: string;
    stateId?: string;
  }): Promise<Holiday[]> {
    return this.getAll(filters as Record<string, unknown>);
  }
}

export const holidayService = new HolidayService();
