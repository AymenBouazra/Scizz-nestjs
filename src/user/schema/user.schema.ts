import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ 
  timestamps: true, 
  versionKey: false 
})
export class User extends Document {
  @Prop({ 
    required: true,
    type: String,
  })
  firstname: string;

  @Prop({ 
    required: true,
    type: String,
  })
  lastname: string;

  @Prop({ 
    unique: true, 
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
   type: [mongoose.Schema.Types.ObjectId], ref: 'Url'
  })
  urlIds: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);