import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @Length(3, 20)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @Length(3, 20)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
