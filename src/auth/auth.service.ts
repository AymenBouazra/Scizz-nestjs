import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createTransport } from 'nodemailer'
import * as bcrypt from 'bcryptjs';
import * as randomString from 'randomstring'
import { JwtService } from '@nestjs/jwt';
import { Token } from './schema/reset-token.schema';
import { Auth } from './schema/auth.schema';
import { RegisterDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'src/jwt.payload';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<Token>,
    private readonly jwtService: JwtService,
  ) { }
  async signUp(registerDto: RegisterDto) {
    const { firstname, lastname, password, email } = registerDto;
    const found = await this.authModel.findOne({ email })
    if (found) {
      return new HttpException({ message: 'A user with this email already exist!' }, HttpStatus.BAD_REQUEST);
    } else {
      const hash = await bcrypt.hash(password, 10);
      const user = await this.authModel.create({
        firstname,
        lastname,
        email,
        password: hash,
      });
      const transporter = createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      await transporter.sendMail({
        from: `"Url Shortner" ${process.env.EMAIL}`,
        to: email,
        subject: "Account created ✔",
        html: `
        <b>Your account was created successfully</b>
        `,
      });
      return new HttpException({ message: 'You have been registered successfully!', user }, HttpStatus.CREATED);
    }
  }

  async signIn(loginDto: LoginDto) {
    const { password, email } = loginDto;
    const auth = await this.authModel.findOne({ email });
    if (auth) {
        const validPassword = await bcrypt.compare(password, auth.password)
        if (validPassword) {
          const token = await this.jwtService.signAsync({ id: auth._id });
          return new HttpException({ message: 'Welcome ' + auth.firstname, token }, HttpStatus.OK);
        }
        else {
          return new HttpException({ message: 'Email or password incorrect!' }, HttpStatus.BAD_REQUEST);
        }
    } else {
      return new HttpException({ message: 'Email or password incorrect!' }, HttpStatus.BAD_REQUEST);
    }
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    try {
      const { email } = forgetPasswordDto;    
      const auth = await this.authModel.findOne({ email });      
      if (auth) {
        const resetToken = randomString.generate(30)
        await this.tokenModel.create({
          resetToken: resetToken,
          userId: auth._id
        });
        const transporter = createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });

        await transporter.sendMail({
          from: `"Aymen Boauzra" ${process.env.EMAIL}`,
          to: email,
          subject: "Forgot password account ✔",
          html: ` 
            <h2>Reset password</h2><br>
            <a href='${process.env.HOST}/reset-password/${resetToken}'>Reset password link</a>
            <b style='color:red'>This link will expire after 15 minutes </b>
            `,
        });
        return new HttpException({ message: 'Please check your mailbox to reset your account\'s password!' }, HttpStatus.OK);
      } else {
        return new HttpException({ message: 'Cannot find any user wih this email, try again with an existing e-mail account!' }, HttpStatus.NOT_FOUND);
      }
    } catch (error) {

      return new HttpException({ message: 'Internal server error!',error}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, token: string) {

    const { password } = resetPasswordDto;
  
    const tokenFound = await this.tokenModel.findOne({ resetToken: token });
    if (tokenFound) {
      const auth = await this.authModel.findById(tokenFound.userId);
      if (auth) {
        const hash = await bcrypt.hash(password, 10);
        await this.authModel.findByIdAndUpdate(tokenFound.userId, { password: hash }, { new: true });
        const transporter = createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });

        await transporter.sendMail({
          from: `"Aymen Boauzra" ${process.env.EMAIL}`,
          to: auth.email,
          subject: "Account password reset ✔",
          html: ` 
            <b>Your password has been reset successfully</b><br>
          `,
        });
        return new HttpException({ message: 'Password has been reset!' }, HttpStatus.OK);
      } else {
        return new HttpException('Password reset link expired or invalid, create a new password reset!', HttpStatus.BAD_REQUEST);
      }
    } else {
      return new HttpException('Password reset link expired or invalid, create a new password reset!', HttpStatus.BAD_REQUEST);
    }
  }
  async getProfile(token: string) {
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const { id } = decodedToken;
      const user = await this.authModel.findById(id).populate('urlIds').lean().exec();
      return user;
    } else {
      throw new HttpException({ message: 'No token provided' }, HttpStatus.BAD_REQUEST);
    }
  }

}