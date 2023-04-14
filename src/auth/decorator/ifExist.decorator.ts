import { ClassConstructor } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

//https://stackoverflow.com/questions/60451337/password-confirmation-in-typescript-with-class-validator
export const IfExist = <T>(
  type: ClassConstructor<T>,
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsUserAlreadyExist,
    });
  };
};

@ValidatorConstraint({ name: 'IfExist' })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(protected readonly usersService: UsersService) {}

  async validate(text: string) {
    const user = await this.usersService.findOneByEmail({
      email: text,
    });
    return !user;
  }
}
