import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './schema/users.schema';
import { AuthGuard, TokenEmail } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Context } from 'vm';
import { NotFoundException } from '@nestjs/common';

const authGuard = new AuthGuard();
@Resolver(() => Users)
@UseGuards(authGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [Users], { name: 'ListAllUsers' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAll(obj, args, context: Context, info): Promise<Users[]> {
    return await this.usersService.findAll();
  }
  @Query(() => Users, { name: 'getUserBy' })
  async findOne(
    @Args(
      'email',
      {
        nullable: true,
        description: 'Email of the user',
      },
      new TokenEmail(authGuard),
    )
    email?: string,
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
}
