import { BaseService } from "./BaseService";
import type {
  GradeLeavePolicy,
  CreateGradeLeavePolicyDto,
  UpdateGradeLeavePolicyDto,
} from "../types";

class GradeLeavePolicyService extends BaseService<
  GradeLeavePolicy,
  CreateGradeLeavePolicyDto,
  UpdateGradeLeavePolicyDto
> {
  constructor() {
    super("/grades"); // Base endpoint, policies nested under grades/{gradeId}/policies
  }

  async getByGrade(
    gradeId: string,
    financialYearId?: string
  ): Promise<GradeLeavePolicy[]> {
    const params = financialYearId ? { financialYearId } : undefined;
    return this.customGet(`/${gradeId}/policies`, params);
  }

  async createForGrade(
    gradeId: string,
    data: CreateGradeLeavePolicyDto
  ): Promise<GradeLeavePolicy> {
    return this.customPost(`/${gradeId}/policies`, data);
  }

  async updateForGrade(
    gradeId: string,
    policyId: string,
    data: UpdateGradeLeavePolicyDto
  ): Promise<GradeLeavePolicy> {
    const response = await this.customPost(
      `/${gradeId}/policies/${policyId}`,
      data
    );
    return response as GradeLeavePolicy;
  }
}

export const gradeLeavePolicyService = new GradeLeavePolicyService();
