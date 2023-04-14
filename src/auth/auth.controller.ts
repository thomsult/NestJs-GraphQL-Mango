import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup';
import { LoginDto } from './dto/login';
import { AuthView } from './auth.view';

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
  async LoginPost(@Body() login: LoginDto) {
    const user = await this.authService.Login(login);
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
