import { IsString, IsOptional, IsInt, IsUrl, IsBoolean } from 'class-validator';

export class CreateLostItemDto {


  @IsString()
  title: string
    
  @IsString()
  description: string;

  // @IsString()
  photo: string;

  // @IsBoolean()
  // isClaimed: boolean;

  @IsString()
  phoneNumber: string;

  // @IsOptional()
  // @IsInt()
  // userId?: number; 
}
