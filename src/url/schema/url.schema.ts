import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as randomString from 'randomstring';

@Schema({ 
  timestamps: true, 
  versionKey: false 
})
export class Url extends Document {
  @Prop({    
    unique: true, 
    required: true,
    type: String,
  })
  originalUrl: string;

  @Prop({ 
    unique: true, 
    type: String, 
    default: () => randomString.generate({
      length: 8,
      charset: 'alphabetic'
    })
  })
  shortenedUrl: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);