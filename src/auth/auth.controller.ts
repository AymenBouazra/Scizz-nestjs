import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register-user.dto";
import { LoginDto } from "./dto/login-user.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) { }

  @Post('/register')
  register(@Body(new ValidationPipe()) registerDto: RegisterDto): Promise<any> {
    try {
      const data = this.userService.signUp(registerDto);
      return data
    } catch (error) {
      return error;
    }
  }
  
  @Post('/login')
  login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<any> {
    return this.userService.signIn(loginDto);
  }

  @Post('/forgot-password')
  forgetPassword(@Body(new ValidationPipe()) forgetPasswordDto: ForgetPasswordDto): Promise<any> {  
    return this.userService.forgetPassword(forgetPasswordDto);
  }

  @Put('/reset-password/:token')
  resetPassword(@Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto, @Param('token') token: string): Promise<any> {
    return this.userService.resetPassword(resetPasswordDto, token);
  }

  @Get('/profile/:token')  
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request): Promise<any> { 
    return this.userService.getProfile(req['user']._id);
  }
}