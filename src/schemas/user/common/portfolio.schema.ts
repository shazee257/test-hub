import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Portfolio {
  @Prop({ type: [String], default: [] })
  photos: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
