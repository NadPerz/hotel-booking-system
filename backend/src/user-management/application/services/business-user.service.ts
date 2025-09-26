import { Injectable } from '@nestjs/common';
import { BusinessOnboardingSchema } from '@shared/types/user-management/BusinessOnboardingSchema';
import { Branch } from 'src/user-management/domain/branch/branch.entity';
import { BusinessAccount } from 'src/user-management/domain/business-account/business-account.entity';
import { BranchRepository } from 'src/user-management/domain/repositories/branch.repository';
import { BusinessAccountRepository } from 'src/user-management/domain/repositories/business-account.repository';

@Injectable()
export class BusinessUserService {
  constructor(
    private readonly businessAccountRepository: BusinessAccountRepository,
    private readonly branchRepository: BranchRepository,
  ) {}

  async completeOnboarding(body: BusinessOnboardingSchema) {
    const ownerId = '123';
    const businessAccount = new BusinessAccount(
      undefined,
      ownerId,
      body.type,
      body.brandName,
      body.primaryContactNumber,
      body.legalEntityName,
      body.legalEntityAddress,
      body.legalEntitySigner,
    );

    const savedBusinessAccount =
      await this.businessAccountRepository.save(businessAccount);

    const branch = new Branch(
      undefined,
      savedBusinessAccount.id!,
      body.branch.bName,
      body.branch.bLocation,
    );
    const savedBranch = await this.branchRepository.save(branch);

    return {
      businessAccount: savedBusinessAccount,
      branch: savedBranch,
    };
  }
}
