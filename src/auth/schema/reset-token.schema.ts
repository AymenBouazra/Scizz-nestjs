import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


@Schema({
    timestamps: true,
    versionKey: false,
})
export class Token extends Document {
    @Prop()
    resetToken: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId: MongooseSchema.Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
