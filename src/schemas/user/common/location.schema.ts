import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ type: [Number], index: '2dsphere' })
  coordinates: [number, number];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
