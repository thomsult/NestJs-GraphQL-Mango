import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup';
import { AuthView } from './auth.view';

import { AuthGuard } from '@nestjs/passport';
import { localAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authView: AuthView,
  ) {}
  //SignUp
  @Get('signup')
  Signup() {
    return this.authView.SignUpView();
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('signup')
  SignUpPost(@Body() signUpDto: SignUpDto) {
    return this.authService.SignUpPost(signUpDto);
  }
  //Login
  @Get('login')
  Login() {
    return this.authView.LoginView();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login')
  @UseGuards(localAuthGuard)
  async LoginPost(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('refresh')
  getRefresh(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.refreshToken(token);
  }
}
