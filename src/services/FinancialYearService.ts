import { BaseService } from "./BaseService";
import type {
  FinancialYear,
  CreateFinancialYearDto,
  UpdateFinancialYearDto,
} from "../types";

class FinancialYearService extends BaseService<
  FinancialYear,
  CreateFinancialYearDto,
  UpdateFinancialYearDto
> {
  constructor() {
    super("/financialyears");
  }

  async getCurrent(): Promise<FinancialYear | null> {
    try {
      return await this.customGet("/current");
    } catch {
      return null;
    }
  }
}

export const financialYearService = new FinancialYearService();
