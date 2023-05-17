import {
  Body,
  Controller,
  Req,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ResetPasswordDto, UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/')
  @UseInterceptors(FileInterceptor(''))
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getUser(@Req() req) {
    return this.userService.findUser({ _id: req.user.id });
  }

  @Post('/update/me')
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(AuthGuard('jwt'))
  updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: Request) {
    return this.userService.findAll(req);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  findUser(@Param() param) {
    return this.userService.findUser({ _id: param.id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/users/',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '.' + file.mimetype.split('/')[1]);
        },
      }),
      fileFilter: (req, file, cb) => {
        // mine type validation
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@Req() req, @UploadedFile() file) {
    return this.userService.uploadImage(req.user.id, file.filename);
  }

  @Put('/reset-password')
  @UseGuards(AuthGuard('jwt'))
  resetPassword(@Req() req, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(req.user.id, resetPasswordDto);
  }
}
