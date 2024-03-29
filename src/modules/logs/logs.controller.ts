import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '@/guards/jwt.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Serialize } from '@/decorators/serialize.decorator';
import { CaslGuard } from '@/guards/casl.guard';
import { Can, CheckPolices } from '../../decorators/casl.decorator';
import { Logs } from '../../entity/logs.entity';
import { Action } from '@/enum/action.enum';

class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard, CaslGuard)
// @UseGuards()
@CheckPolices((ability) => ability.can(Action.Read, Logs))
@Can(Action.Read, Logs)
// UserInterceptor(new SerializationInterceptor(DTO))
export class LogsController {
  @Get()
  @Can(Action.Read, Logs)
  getTest() {
    return 'test';
  }

  @Post()
  @Can(Action.Create, Logs)
  @Serialize(PublicLogsDto)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log(
      '🚀 ~ file: logs.controller.ts ~ line 15 ~ LogsController ~ postTest ~ dto',
      dto,
    );
    return dto;
  }
}
