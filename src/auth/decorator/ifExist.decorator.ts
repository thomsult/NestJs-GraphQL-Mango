import { ClassConstructor } from 'class-transformer';
import { UsersService } from '../../users/users.service';
import { Injectable } from '@nestjs/common';

import {
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

  validate = async (text: string) =>
    !(await this.usersService.find({ where: { email: text } }));
}
