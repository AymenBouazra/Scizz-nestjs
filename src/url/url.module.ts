import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlSchema } from './schema/url.schema';
import { AuthSchema } from 'src/auth/schema/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema }, {name: 'Auth', schema: AuthSchema}]),
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
