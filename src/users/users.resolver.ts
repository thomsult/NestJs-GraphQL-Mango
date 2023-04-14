import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './schema/users.schema';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Context } from 'vm';


@Resolver(() => Users)
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [Users], { name: 'ListAllUsers' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findAll(obj, args, context: Context, info): Promise<Users[]> {
    console.log(context.req.user);
    return this.usersService.findAll();
  }
}
