import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
export type UsersDocument = HydratedDocument<Users>;

@Schema()
@ObjectType()
export class Users {
  @Field(() => String)
  _id?: MongooseSchema.Types.ObjectId;
  @Field(() => String, { description: 'User email ' })
  @Prop()
  email: string;
  @Prop()
  hashedPassword: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
