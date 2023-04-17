import { Injectable } from '@nestjs/common';
import { Users } from './schema/users.schema';
import { Model, ObjectId } from 'mongoose';
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
  RemoveUser(id: ObjectId): Promise<Users> {
    return this.userModel.findByIdAndRemove(id).exec();
  }
  async findOneByEmail({ email }): Promise<Users> {
    const user: Users = await this.userModel.findOne({ email });
    return user;
  }
  async findAll(): Promise<Users[]> {
    const user = await this.userModel.find().select('-hashedPassword');
    return user;
  }
  // External provider
  async FindOrCreateUserExt(user): Promise<Users> {
    const selectUser = await this.findOneByEmail({
      email: user.email,
    });
    if (selectUser) {
      return selectUser;
    }
    return this.CreateUser(user);
  }
}
