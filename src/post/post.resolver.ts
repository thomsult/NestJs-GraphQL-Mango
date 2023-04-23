import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Prisma } from '@prisma/client';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from 'src/common/utils/decorator';
import { FindManyPostsArgs } from '../@generated/posts/find-many-posts.args';
import { FindUniquePostsArgs } from 'src/@generated/posts/find-unique-posts.args';
import { PostsCreateWithoutAuthorInput } from 'src/@generated/posts/posts-create-without-author.input';
import { Posts } from 'src/@generated/posts/posts.model';
import { PostsUpdateInput } from '../@generated/posts/posts-update.input';
import { DeleteOnePostsArgs } from 'src/@generated/posts/delete-one-posts.args';
import { PostsCreateInput } from 'src/@generated/posts/posts-create.input';
import { CreateOnePostsArgs } from 'src/@generated/posts/create-one-posts.args';
import { FindPostsRawArgs } from 'src/@generated/prisma/find-posts-raw.args';
import { BoolFilter } from '../@generated/prisma/bool-filter.input';

@UseGuards(JwtAuthGuard)
@Resolver(() => Posts)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Posts)
  createPost(
    @Args('createPostInput') createPostInput: PostsCreateWithoutAuthorInput,
    @User() ctx: { id: string },
  ) {
    console.log(ctx);
    const PostData: CreateOnePostsArgs = {
      data: {
        ...createPostInput,
        author: {
          connect: {
            id: ctx.id,
          },
        },
      },
    };
    return this.postService.create(PostData);
  }

  @Query(() => [Posts], { name: 'posts' })
  async findAll(@Args() FindManyPostsArgs: FindManyPostsArgs) {
    return await this.postService.findAll(FindManyPostsArgs);
  }

  @Query(() => Posts, { name: 'post' })
  findOne(@Args() FindUniquePostsArgs: FindUniquePostsArgs) {
    return this.postService.findOne(FindUniquePostsArgs);
  }

  @Mutation(() => Posts)
  updatePost(
    @Args('postsUpdateInput') postsUpdateInput: PostsUpdateInput,
    @Args('id') id: string,
  ) {
    return this.postService.update(id, postsUpdateInput);
  }

  @Mutation(() => Posts)
  removePost(@Args() deletePost: DeleteOnePostsArgs) {
    return this.postService.remove(deletePost);
  }

  @Query(() => [Posts], { name: 'PublicPost' }) //[Posts]
  async findPublicPost() {
    const published: BoolFilter = {
      equals: true,
    };
    return await this.postService.findAll({
      where: {
        published,
      },
    });
  }
}
