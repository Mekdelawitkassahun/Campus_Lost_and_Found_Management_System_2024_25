import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';  
import { CreateLostItemDto } from './dto/create-lost-item.dto';  
import { UpdateLostItemDto } from './dto/update-lost-item.dto';  
import { ClaimLostItemDto } from './dto/claim-lost-item.dto';  
import { LostItem } from '@prisma/client';

@Injectable()
export class LostItemsService {
  constructor(private prisma: PrismaService) {}

  // Create
  async create(createLostItemDto: CreateLostItemDto, userId: number, photoPath: string) {
    try {
      console.log('Creating lost item with data:', createLostItemDto, photoPath);
      return await this.prisma.lostItem.create({
        data: {
          title: createLostItemDto.title,
          description: createLostItemDto.description,
          photo: photoPath,
          phoneNumber: createLostItemDto.phoneNumber,
          isClaimed: false,
        },
      });
    } catch (error) {
      console.error('Error creating lost item:', error);
      throw new InternalServerErrorException('Could not create lost item');
    }
  }

  // Get all lost items
  async findAll() {
    try {
      return await this.prisma.lostItem.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Could not fetch lost items');
    }
  }

  // Get a lost item by ID
  async findOne(id: number) {
    try {
      const lostItem = await this.prisma.lostItem.findUnique({ where: { id } });
      if (!lostItem) {
        throw new NotFoundException('Lost item not found');
      }
      return lostItem;
    } catch (error) {
      throw new InternalServerErrorException('Could not fetch lost item');
    }
  }

  // Update
  async update(id: number, updateLostItemDto: UpdateLostItemDto):Promise<LostItem> {
    const item = await this.prisma.lostItem.findUnique({where: {id}})

    if (!item) {
      throw new NotFoundException("Lost item not found")
    }

    return this.prisma.lostItem.update({
      where: {id},
      data: updateLostItemDto,
    })

    // try {
    //   const updatedLostItem = await this.prisma.lostItem.update({
    //     where: { id },
    //     data: updateLostItemDto,
    //   });
    //   return updatedLostItem;
    // } catch (error) {
    //   if (error.code === 'P2025') {
    //     throw new NotFoundException('Lost item not found');
    //   }
    //   console.error('Error updating lost item:', error.message);
    //   throw new InternalServerErrorException('Could not update lost item');
    // }
  }
  

  // Delete
  async remove(id: number) {
    try {
      await this.prisma.lostItem.delete({ where: { id } });
      return { message: 'Lost item deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Lost item not found');
      }
      throw new InternalServerErrorException('Could not delete lost item');
    }
  }

  // Claim a lost item
  // async claimLostItem(id: number, claimLostItemDto: {userId: number}) {
  //   try {
  //     const lostItem = await this.prisma.lostItem.findUnique({ where: { id } });
  //     if (!lostItem) {
  //       throw new NotFoundException('Lost item not found');
  //     }

  //     const existingClaim = await this.prisma.claim.findFirst({
  //       where: { lostItemId: id, userId: claimLostItemDto.userId },
  //     });

  //     if (existingClaim) {
  //       throw new BadRequestException('You have already claimed this item');
  //     }

  //     return await this.prisma.claim.create({
  //       data: {
  //         lostItemId: id,
  //         userId: claimLostItemDto.userId,
  //         status: 'pending', // default status for claims
  //       },
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException('Could not claim lost item');
  //   }
  // }

  async createClaim(userId: number, claimLostItem: ClaimLostItemDto) {
    const { lostItemId,} = claimLostItem;


    // Check if the lost item exists
    const lostItem = await this.prisma.lostItem.findUnique({ where: { id: lostItemId } });
    if (!lostItem) {
      throw new NotFoundException(`Lost item with ID ${lostItemId} not found.`);
    }

    // Check if the user has already claimed this item
    const existingClaim = await this.prisma.claim.findFirst({
      where: { userId, lostItemId },
    });
    if (existingClaim) {
      throw new BadRequestException('You have already claimed this item.');
    }

    // Create the claim
    return this.prisma.claim.create({
      data: {
        userId,
        lostItemId,
        status: 'pending', // Default status
      },
    });
  }
}
