import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
  Logger,
  Get,
  Req,
} from '@nestjs/common';
import { TypeormFilter } from '@/filters/typeorm.filter';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter(new Logger()))
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    const { token, menus } = await this.authService.signin(username, password);
    await this.redis.set(username, token);
    return {
      access_token: token,
      menus,
    };
  }

  @Post('/signup')
  signup(@Body() dto: SigninUserDto) {
    const { username, password, nickname } = dto;
    return this.authService.signup(username, nickname, password);
  }
}
