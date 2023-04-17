import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import * as crypto from 'crypto';

export type UsersDocument = HydratedDocument<Users>;

function gravatar(user: Users) {
  const hash = crypto.createHash('md5').update(user.email).digest('hex');
  return `https://gravatar.com/avatar/${hash}?s=200&d=retro`;
}

@Schema()
@ObjectType()
export class Users {
  @Field(() => String)
  _id?: MongooseSchema.Types.ObjectId;
  @Field(() => String, { description: 'User email ' })
  @Prop()
  email: string;
  @Prop()
  hashedPassword?: string;
  @Field(() => String, { description: 'first Name ' })
  @Prop({
    default: 'John',
  })
  firstName?: string;
  @Field(() => String, { description: 'last Name ' })
  @Prop({
    default: 'Doe',
  })
  lastName?: string;
  @Field(() => String, { description: 'User picture ' })
  @Prop({
    default: gravatar,
  })
  picture?: string;
  @Field(() => String, { description: 'User provider ' })
  @Prop({ default: 'local' })
  provider?: string;
  @Field(() => String, { description: 'User provider id ' })
  @Prop({ default: 'local' })
  providerId?: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
