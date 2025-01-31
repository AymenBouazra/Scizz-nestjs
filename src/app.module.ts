import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UrlModule,
    MongooseModule.forRoot('mongodb://localhost:27017/url-shortener')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
