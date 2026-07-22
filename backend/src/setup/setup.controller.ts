import { Controller, Post } from '@nestjs/common';

import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(
    private readonly setupService: SetupService,
  ) {}

  @Post('install')
  install() {
    return this.setupService.install();
  }
}