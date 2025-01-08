import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Req, UnauthorizedException, ParseIntPipe, Put, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { LostItemsService } from './lost-items.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard'; 
import { Roles } from 'src/roles/roles.decorator';
import { Request } from 'express';
import { CreateLostItemDto } from './dto/create-lost-item.dto';
import { Role } from 'src/roles/roles.enum';
import { User } from '@prisma/client';
import { UpdateLostItemDto } from './dto/update-lost-item.dto';
import { ClaimLostItemDto } from './dto/claim-lost-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('lost-items')
export class LostItemsController {
  constructor(private readonly lostItemsService: LostItemsService) {}

  @UseGuards(AuthGuard('jwt'))
  // @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads', // Local directory to store images
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename); // Naming the file with timestamp to avoid overwriting
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // Max file size of 10MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed file types
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createAndUploadPhoto(
    @Body() createLostItemDto: CreateLostItemDto, // Item details like title, description, etc.
    @Req() req: Request, // Access user data (admin validation)
    @UploadedFile() file: Express.Multer.File, // The uploaded file
  ) {
    const user = req.user as User;
    if (user.role !== 'Admin') {
      throw new UnauthorizedException('Only admins can post lost items');
    }

    // Check if the file was uploaded successfully
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Save the file path (relative to the public directory) to the database
    const photoPath = `/uploads/${file.filename}`;


    createLostItemDto.photo = photoPath;
    // Call the service to create a lost item in the database with the file path
    return this.lostItemsService.create(
      createLostItemDto,
      user.id,
      photoPath          
    );
  }


  // Everyone (both user and admin) can see all lost items
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.lostItemsService.findAll();
  }

  // Get a single lost item by its ID
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number) {
    return this.lostItemsService.findOne(id);
  }

  // Only users can claim a lost item
  // @UseGuards(AuthGuard('jwt'))
  // @Roles(Role.USER)
  // @Post('claim')
  // async claim(@Body() claimLostItem: ClaimLostItemDto, @Req() req: Request) {
  //   console.log('Request body:', req.body); // Log raw request body
  // console.log('DTO received:', claimLostItem);
  //   const user = req.user as User; // `req.user` should be populated by the JWT Auth Guard
    

  //   if (!claimLostItem.lostItemId) {
  //     throw new BadRequestException('Missing lostItemId in the request body.');
  //   }


  //   return this.lostItemsService.createClaim(user.id, claimLostItem);
  // }
  // async claim(@Param('id',ParseIntPipe) id: number) {
  //   // const user = req.user as User; 
  //   // if (user.role !== 'user') {
  //   //   throw new UnauthorizedException('Only users can claim lost items');
  //   // }

  //   const claimLostItemDto = {
  //     userId: user.id
  //   }

  //   return this.lostItemsService.claimLostItem(id, claimLostItemDto);
  // }
  

  // update and delete item
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() data: UpdateLostItemDto) {
    // const user = req.user as User; 
    // if (user.role !== 'Admin') {
    //   throw new UnauthorizedException('Only admins can update lost items');
    // }
    return this.lostItemsService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    if (user.role !== 'Admin') {
      throw new UnauthorizedException('Only admins can delete lost items');
    }
    return this.lostItemsService.remove(id);
  }
}
