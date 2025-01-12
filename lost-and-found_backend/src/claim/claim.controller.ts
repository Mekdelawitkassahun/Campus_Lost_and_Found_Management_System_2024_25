import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import { Role } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';

@Controller('claims')
export class ClaimController {
  constructor(private readonly claimsService: ClaimService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  @Post(':lostItemId')
  async create(
    @Param('lostItemId',ParseIntPipe) lostItemId: number,
    // @Body('description') description: string,
    @Req() req: Request,
  ) {
    
    const user = req.user as User;
    console.log(user)
    return this.claimsService.createClaim(user.id, lostItemId);
  }

  @Get()
  // @Roles(Role.ADMIN)
  async findAll() {
    return this.claimsService.findAllClaims();
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN)
  async approve(@Param('id') id: number) {
    return this.claimsService.approveClaim(id);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN)
  async reject(@Param('id') id: number) {
    return this.claimsService.rejectClaim(id);
  }
}

 // @Get('item/:lostItemId')
  // async findForItem(@Param('lostItemId') lostItemId: number) {
  //   return this.claimsService.findClaimsForItem(lostItemId);
  // }