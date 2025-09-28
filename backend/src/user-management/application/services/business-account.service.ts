import { Injectable, Logger } from '@nestjs/common';
import { BusinessOnboardingData } from '@shared/types/user-management';
import { Branch } from 'src/user-management/domain/branch/branch.entity';
import { BusinessAccount } from 'src/user-management/domain/business-account/business-account.entity';
import { BranchRepository } from 'src/user-management/domain/repositories/branch.repository';
import { BusinessAccountRepository } from 'src/user-management/domain/repositories/business-account.repository';
import { UserRepository } from 'src/user-management/domain/repositories/user.repository';

//includes both business account and branch services

@Injectable()
export class BusinessAccountService {
  private readonly logger = new Logger(BusinessAccountService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly businessAccountRepository: BusinessAccountRepository,
    private readonly branchRepository: BranchRepository,
  ) {}

  async completeOnboarding(ownerId: string, body: BusinessOnboardingData) {
    this.logger.log('🚀 Starting onboarding completion');
    this.logger.debug(
      '📋 Received onboarding data:',
      JSON.stringify(body, null, 2),
    );

    this.logger.debug('👤 Using ownerId:', ownerId);

    // Log business account creation
    this.logger.debug('🏢 Creating business account with data:', {
      brandName: body.brandName,
      type: body.type,
      primaryContactNumber: body.primaryContactNumber,
      legalEntityName: body.legalEntityName,
      legalEntityAddress: body.legalEntityAddress,
      legalEntitySigner: body.legalEntitySigner,
    });

    const businessAccount = new BusinessAccount(
      undefined,
      body.brandName,
      ownerId,
      body.type,
      body.primaryContactNumber,
      body.legalEntityName,
      body.legalEntityAddress,
      body.legalEntitySigner,
    );

    this.logger.debug('💾 Saving business account to database...');
    const savedBusinessAccount =
      await this.businessAccountRepository.save(businessAccount);
    this.logger.log(
      '✅ Business account saved with ID:',
      savedBusinessAccount.id,
    );

    // Log branch creation
    this.logger.debug('🏪 Creating branch with data:', {
      businessAccountId: savedBusinessAccount.id,
      branchName: body.branch.bName,
      location: body.branch.bLocation,
    });

    const branch = new Branch(
      undefined,
      savedBusinessAccount.id!,
      body.branch.bName,
      body.branch.bLocation,
    );

    this.logger.debug('💾 Saving branch to database...');
    const savedBranch = await this.branchRepository.save(branch);
    this.logger.log('✅ Branch saved with ID:', savedBranch.id);

    this.logger.debug(
      '👤 Updating user with business account and branch IDs...',
    );
    const user = await this.userRepository.update(ownerId, {
      businessAccountId: savedBusinessAccount.id!,
      branchId: savedBranch.id!,
    });
    this.logger.log('✅ User updated successfully');

    const result = {
      user: user,
      businessAccount: savedBusinessAccount,
      branch: savedBranch,
    };

    this.logger.log('🎉 Onboarding completed successfully');
    this.logger.debug('📊 Final result:', JSON.stringify(result, null, 2));

    return result;
  }

  //TODO use transactions to delete business account and branch
  async deleteBusinessAccount(id: string) {
    try {
      this.logger.debug(`Deleting business account ${id}`);
      await this.businessAccountRepository.delete(id);
      this.logger.debug(`Deleted business account ${id}`);
      this.logger.debug(`Deleting branch ${id}`);
      await this.branchRepository.delete(id);
      this.logger.debug(`Deleted branch ${id}`);
    } catch (error) {
      this.logger.error('Failed to delete business account', error);
      throw new Error('Failed to delete business account');
    }
  }
}
