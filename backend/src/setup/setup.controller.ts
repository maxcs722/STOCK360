import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { InstallDto } from './dto/install.dto';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(
    private readonly setupService: SetupService,
  ) {}

  @Post('install')
  install(@Body() dto: InstallDto) {
    return this.setupService.install(dto);
  }
}