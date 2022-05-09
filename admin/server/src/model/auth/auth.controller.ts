import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Res, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/metadatas/auth';
import { Response } from 'express';
import { JwtRefreshAuthGuard } from 'src/common/guards/auth/jwt';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService ) {}

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const result = await this.authService.signup(signupDto);
    
    return { message: "User added successfully", result }
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto, res);
    
    return { message: "User logged in successfully", result }
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
      const userToken = req.user;

      return this.authService.refreshTokens(userToken, res);
  }

}
