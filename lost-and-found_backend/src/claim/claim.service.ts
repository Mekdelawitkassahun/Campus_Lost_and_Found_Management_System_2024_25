import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClaimService {
  constructor(private readonly prisma: PrismaService) {}

  async createClaim(userId: number, lostItemId: number) {
    // Check if lost item exists
    const lostItem = await this.prisma.lostItem.findUnique({ where: { id: lostItemId } });
    if (!lostItem) throw new NotFoundException('Lost item not found');

    const existingClaim = await this.prisma.claim.findFirst({
      where: { userId, lostItemId },
    });
    if (existingClaim) {
      throw new ConflictException('You have already claimed this lost item');
    }
    console.log(userId,lostItemId)

    return this.prisma.claim.create({
      data: {
        userId,
        lostItemId,
      },
    });
  }

  async findAllClaims() {
    return this.prisma.claim.findMany({
      include: {
        user: true,
        lostItem: true,
        
      },
    });
  }

  async findClaimsForItem(lostItemId: number) {
    return this.prisma.claim.findMany({
      where: { lostItemId },
      include: {
        user: true,
      },
    });
  }

  async approveClaim(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      // Find the claim
      const claim = await prisma.claim.findUnique({ where: { id } });
      if (!claim) throw new NotFoundException('Claim not found');
  
      if (claim.status === 'APPROVED') {
        throw new BadRequestException('Claim has already been approved.');
      }
  
      if (claim.status === 'REJECTED') {
        throw new BadRequestException('Claim has already been rejected.');
      }
      await prisma.claim.update({
        where: { id },
        data: { status: 'APPROVED'},
      });

      if (claim.lostItemId) {
        await this.prisma.lostItem.update({
          where: { id: claim.lostItemId },
          data: { isClaimed: true },
        });
      }
  
      // Delete the claim
      // await prisma.claim.deleteMany({ where: { id: claim.id } });
      // Delete the lost item
      await prisma.lostItem.delete({ where: { id: claim.lostItemId } });
        
      return { message: 'Claim approved, lost item and claim removed.' };
    });
  }
  

  async rejectClaim(id: number) {
    const claim = await this.prisma.claim.findUnique({ where: { id } });
    if (!claim) throw new NotFoundException('Claim not found');

    return this.prisma.claim.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }
}
