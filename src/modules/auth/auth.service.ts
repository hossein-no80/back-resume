import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findUserByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }
    // const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // const newUser = await this.usersService.createUser({
    //   ...registerDto,
    //   password: hashedPassword,
    // });
    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;
    if (email !== process.env.ADMIN_EMAIL) {
      throw new UnauthorizedException('Access denied: only admin can login');
    }
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Wrong password', 400);
    }

    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
    );

    // ذخیره refresh token هش شده در دیتابیس (اختیاری)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    // قراردادن Refresh Token در HttpOnly Cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // در توسعه false
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 روز
    });

    return { access_token: accessToken };
  }

  async refreshTokens(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOneById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Refresh token mismatch');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        this.generateTokens(user.id, user.email);
      const newHashedRefresh = await bcrypt.hash(newRefreshToken, 10);
      await this.usersService.updateRefreshToken(user.id, newHashedRefresh);

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: number, res: Response) {
    await this.usersService.updateRefreshToken(userId, null);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
