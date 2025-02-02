import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { firstname, lastname, email, password } = createUserDto;
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      return new HttpException({ message: 'User already exists' }, HttpStatus.BAD_REQUEST);
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ firstname, lastname, email, password: hash });
    throw new HttpException({ message: 'User created', user }, HttpStatus.CREATED);
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { firstname, lastname, email, password } = updateUserDto;
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await this.userModel.findByIdAndUpdate(id, { $set: { password: hash } }).lean();
    }
    await this.userModel.findByIdAndUpdate(id , { $set: { firstname, lastname, email } }).lean();
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
    await this.userModel.findByIdAndDelete(id).lean();
    return user;
  }
}
