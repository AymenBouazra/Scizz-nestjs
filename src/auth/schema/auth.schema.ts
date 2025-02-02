import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Url } from "src/url/schema/url.schema";
@Schema({
    timestamps: true,
    versionKey: false,
})
export class Auth extends Document {
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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Url' }],
    default: [],
  })
  urlIds: mongoose.Schema.Types.ObjectId[] | Url[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);