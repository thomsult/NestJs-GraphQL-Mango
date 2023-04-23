import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import gravatar from 'src/common/utils/gravatar';
import { FindManyUsersArgs } from 'src/@generated/users/find-many-users.args';
import { FindUniqueUsersArgs } from 'src/@generated/users/find-unique-users.args';
import { Users } from 'src/@generated/users/users.model';
import { CreateOneUsersArgs } from 'src/@generated/users/create-one-users.args';
import { roleName } from 'src/@generated/prisma/role-name.enum';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async CreateUser(userData) {
    userData.accessToken = undefined;
    if (!userData.picture) {
      userData.picture = gravatar({ email: userData.email });
    }
    const NewUser: CreateOneUsersArgs = {
      data: {
        ...userData,
        lastLogin: new Date(),
        registeredAt: new Date(),
        role: {
          create: {
            name: roleName.USER,
          },
        },
      },
    };

    const createdUser = await this.prisma.users.create(NewUser);
    return createdUser;
  }
  async RemoveUser(id: string): Promise<Users> {
    return await this.prisma.users.delete({ where: { id } });
  }
  async FindOrCreateUserExt(user): Promise<Users> {
    const selectUser = await this.prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });
    if (selectUser) {
      return selectUser;
    }
    return this.CreateUser(user);
  }
  async find(UniqueUsers: FindUniqueUsersArgs): Promise<Users | null> {
    return await this.prisma.users.findUnique(UniqueUsers);
  }
  async findAll(ManyUsersArgs: FindManyUsersArgs): Promise<Users[]> {
    const users: Users[] = await this.prisma.users.findMany(ManyUsersArgs);
    const data = users.map(async (user) => {
      user.Posts = await this.prisma.posts.findMany({
        where: {
          authorId: user.id,
        },
      });
      return user;
    });

    return Promise.all(data);
  }
}
