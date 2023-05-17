import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  Max,
  Min,
  IsNumber,
} from 'class-validator';

// create user dto
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  @IsString()
  fcmToken: string;
}

// update user dto
export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  hiddenEmail: boolean;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNotEmpty()
  hiddenLastName: boolean;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsString()
  mobile: string;

  @IsNotEmpty()
  hiddenMobile: boolean;

  @IsString()
  language: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
