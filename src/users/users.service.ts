import { Injectable } from '@nestjs/common';
import { Users } from './schema/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<Users>,
  ) {}
  CreateUser(user: Users): Promise<Users> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
  async findOneByEmail({ email }): Promise<Users> {
    const user: Users = await this.userModel.findOne({ email });
    return user;
  }
  findAll() {
    return this.userModel.find().select('-hashedPassword').exec();
  }
}
