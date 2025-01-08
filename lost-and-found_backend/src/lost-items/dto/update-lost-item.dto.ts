import { IsString, IsOptional, IsInt, IsUrl, IsBoolean } from 'class-validator';

export class UpdateLostItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // @IsOptional()
  // @IsInt()
  // userId?: number; 

  @IsOptional()
  @IsBoolean()
  isClaimed: boolean
}

// export class UpdateLostItemDto {
//   isClaimed? : boolean // Optional fields
//   userId?: number; // Optional fi
// }

