import { IsEmail, IsNotEmpty, Length } from 'class-validator';

import { Match } from '../decorator/match.decorator';
import { IfExist } from '../decorator/ifExist.decorator';

export class SignUpDto {
  @Length(3, 20)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  @IfExist(SignUpDto, 'email', {
    message: 'Email already exists',
  })
  email: string;

  @Length(3, 20)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Length(3, 20)
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @Match(SignUpDto, (s) => s.password, {
    message: 'Password confirmation does not match',
  })
  passwordConfirmation: string;
}
