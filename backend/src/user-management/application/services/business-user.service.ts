import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessUserService {
  constructor() {}

  completeRegistration() {
    return 'completed registration';
  }
}
