// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import type { RequestWithUser } from '../../../core/guards/userGuard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // register(@Body() registerDto: RegisterDto) {
  //   return this.authService.register(registerDto);
  // }
  @ApiOperation({ summary: 'ثبت‌نام (غیرفعال شده)' })
  @ApiResponse({ status: 403, description: 'Registration is disabled' })
  @Post('register')
  register() {
    throw new ForbiddenException('Registration is disabled');
  }

  @Post('login')
  @ApiOperation({ summary: 'ورود به سیستم و دریافت توکن' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    type: LoginResponseDto,
    description:
      'ورود موفق - توکن در body و refresh token در کوکی ذخیره می‌شود',
  })
  @ApiUnauthorizedResponse({ description: 'ایمیل یا رمز عبور اشتباه است' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'تمدید توکن دسترسی با استفاده از Refresh Token (در کوکی)',
  })
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({ type: LoginResponseDto, description: 'توکن جدید صادر شد' })
  @ApiUnauthorizedResponse({
    description: 'Refresh token نامعتبر یا منقضی شده است',
  })
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = req.cookies['refresh_token'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.refreshTokens(refreshToken, res);
  }

  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'خروج از سیستم و حذف Refresh Token (ادمین)' })
  @ApiOkResponse({ type: MessageResponseDto, description: 'خروج موفق' })
  @ApiUnauthorizedResponse({ description: 'توکن دسترسی نامعتبر است' })
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.id; // دیگر خطا نمی‌دهد
    return this.authService.logout(userId, res);
  }
}
