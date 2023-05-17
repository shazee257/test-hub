import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, ResetPasswordDto, UpdateUserDto } from './dto/user.dto';
import { getEndPoint, getPaginatedData, hashPassword } from 'src/utils';
import { Request } from 'express';
import { User, UserDocument } from 'src/schemas/user/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(req: Request): Promise<any> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const endPoint = getEndPoint(req.originalUrl);

    try {
      const { result, pagination } = await getPaginatedData({
        model: this.userModel,
        page,
        limit,
        query: {},
        sort: { createdAt: -1 },
        populate: '',
        endPoint,
      } as any);

      return { result, pagination };
    } catch (error) {
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }
  }

  async findUser(query: {}): Promise<User> {
    try {
      return await this.userModel.findOne(query).select('+password').exec();
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    // find if user exists
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = new this.userModel();
    newUser.email = createUserDto.email;
    newUser.password = hashPassword(createUserDto.password);
    newUser.role = createUserDto.role;
    newUser.fcmToken = createUserDto.fcmToken;

    return await newUser.save();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const obj: any = {
      ...updateUserDto,
    location: {
      type: 'Point',
      coordinates: [updateUserDto.longitude, updateUserDto.latitude],
    },
    };

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: obj },
      { new: true },
    );

    return updatedUser;
  }

  async saveFcmToken(id: string, fcmToken: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { fcmToken },
      { new: true },
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async uploadImage(id: string, filename: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.image = 'users/' + filename;
    return await user.save();
  }

  async updateUserByQuery(query: {}, update: {}): Promise<User> {
    return await this.userModel.findOneAndUpdate(query, update, { new: true });
  }

  async resetPassword(
    id: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<User> {
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new HttpException(
        'Password and confirm password does not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.password = hashPassword(resetPasswordDto.password);
    return await user.save();
  }
}
