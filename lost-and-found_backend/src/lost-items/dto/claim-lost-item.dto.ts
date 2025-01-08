import { IsString, IsInt } from 'class-validator';

export class ClaimLostItemDto {
  @IsInt()
  lostItemId: number;

  // @IsString()
  // reason: string;
}
