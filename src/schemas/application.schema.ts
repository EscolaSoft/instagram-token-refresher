import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  token: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
