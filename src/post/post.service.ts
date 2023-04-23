import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindUniquePostsArgs } from 'src/@generated/posts/find-unique-posts.args';
import { FindManyPostsArgs } from 'src/@generated/posts/find-many-posts.args';
import { Posts } from 'src/@generated/posts/posts.model';
import { PostsUpdateWithoutAuthorInput } from '../@generated/posts/posts-update-without-author.input';
import { UpdateOnePostsArgs } from 'src/@generated/posts/update-one-posts.args';
import { DeleteOnePostsArgs } from 'src/@generated/posts/delete-one-posts.args';
import { CreateOnePostsArgs } from 'src/@generated/posts/create-one-posts.args';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  create(createPostInput: CreateOnePostsArgs) {
    return this.prisma.posts.create(createPostInput);
  }

  async findAll(findManyPostsArgs: FindManyPostsArgs) {
    const Posts: Posts[] = await this.prisma.posts.findMany(findManyPostsArgs);
    return Posts.map(async (post) => {
      const author = await this.prisma.users.findUnique({
        where: {
          id: post.authorId,
        },
      });
      post.author = author;
      return post;
    });
  }

  findOne(findUniquePostsArgs: FindUniquePostsArgs) {
    return this.prisma.posts.findUnique(findUniquePostsArgs);
  }

  update(id: string, postsUpdateInput: PostsUpdateWithoutAuthorInput) {
    const postData: UpdateOnePostsArgs = {
      where: {
        id: id,
      },
      data: postsUpdateInput,
    };
    return this.prisma.posts.update(postData);
  }

  remove(deletePost: DeleteOnePostsArgs) {
    return this.prisma.posts.delete(deletePost);
  }
}
