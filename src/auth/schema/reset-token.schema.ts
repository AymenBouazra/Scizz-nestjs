import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Token extends Document {
    @Prop({ required: true })
    resetToken: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: Date, expires: 900, default: Date.now }) 
    expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

