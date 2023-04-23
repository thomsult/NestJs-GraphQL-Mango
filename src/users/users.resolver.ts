import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

import { UseGuards } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FindManyUsersArgs } from 'src/@generated/users/find-many-users.args';
import { DeleteOneUsersArgs } from 'src/@generated/users/delete-one-users.args';
import { FindUniqueUsersArgs } from 'src/@generated/users/find-unique-users.args';
import { Users } from 'src/@generated/users/users.model';
@Resolver(() => Users)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Users, { name: 'User' })
  async findOne(@Args() UniqueUsers: FindUniqueUsersArgs): Promise<Users> {
    try {
      const user = await this.usersService.find(UniqueUsers);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException({
        message: error.message,
      });
    }
  }

  @Mutation(() => Users, { name: 'removeUser' })
  async remove(@Args() deleteUser: DeleteOneUsersArgs): Promise<Users> {
    try {
      const user = await this.usersService.find(deleteUser);
      if (!user) {
        throw new Error('User not found');
      }
      return await this.usersService.RemoveUser(user.id);
    } catch (error) {
      throw new NotFoundException({
        message: error.message,
      });
    }
  }

  @Query(() => [Users], { name: 'Users' })
  async find(@Args() userUniqueInput: FindManyUsersArgs): Promise<Users[]> {
    return await this.usersService.findAll(userUniqueInput);
  }
}
