import { BaseService } from "./BaseService";
import type { Grade, CreateGradeDto, UpdateGradeDto } from "../types";

class GradeService extends BaseService<Grade, CreateGradeDto, UpdateGradeDto> {
  constructor() {
    super("/grades");
  }

  async getActive(): Promise<Grade[]> {
    return this.getAll({ activeOnly: true });
  }
}

export const gradeService = new GradeService();
