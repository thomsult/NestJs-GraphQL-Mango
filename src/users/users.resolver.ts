import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './schema/users.schema';
import { UseGuards } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
@Resolver(() => Users)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [Users], { name: 'ListAllUsers' })
  async findAll(): Promise<Users[]> {
    return await this.usersService.findAll();
  }
  @Query(() => Users, { name: 'getUserBy' })
  async findOne(
    @Args('email', {
      description: 'Email of the user',
    })
    email: string,
  ): Promise<Users> {
    try {
      const user = await this.usersService.findOneByEmail({
        email: email,
      });
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
  async remove(
    @Args('email', {
      description: 'Email of the user',
    })
    email: string,
  ): Promise<Users> {
    try {
      const user = await this.usersService.findOneByEmail({
        email: email,
      });
      if (!user) {
        throw new Error('User not found');
      }
      return await this.usersService.RemoveUser(user._id);
    } catch (error) {
      throw new NotFoundException({
        message: error.message,
      });
    }
  }
}
