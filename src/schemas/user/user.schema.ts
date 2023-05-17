import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from 'src/utils';
import { Location, LocationSchema } from './common/location.schema';
import { Portfolio, PortfolioSchema } from './common/portfolio.schema';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ type: Boolean, default: false })
  hiddenEmail: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: Boolean, default: false })
  hiddenLastName: boolean;

  @Prop()
  username: string;

  @Prop({
    type: String,
    enum: [Roles.USER, Roles.ARTIST, Roles.ADMIN],
    default: Roles.USER,
  })
  role: string;

  @Prop()
  about: string;

  @Prop()
  dob: Date;

  @Prop({ type: LocationSchema })
  location: Location;

  @Prop()
  mobile: string;

  @Prop({ type: Boolean, default: false })
  hiddenMobile: boolean;

  @Prop()
  image: string;

  @Prop()
  language: string;

  @Prop()
  fcmToken: string;

  @Prop({ type: PortfolioSchema })
  portfolio: Portfolio;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
