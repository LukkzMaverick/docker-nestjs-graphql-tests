import { InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
}
