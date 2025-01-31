import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './schema/url.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>
  ) {}
  async create(body: CreateUrlDto) {
    const { originalUrl } = body;
    const urlExists = await this.urlModel.findOne({ originalUrl });

    if (urlExists) {
      throw new HttpException({ message: 'URL already exists', shortenedUrl: urlExists.shortenedUrl }, HttpStatus.BAD_REQUEST);
    }
    
    const urlcreate = await this.urlModel.create({ originalUrl }); 
    return  { message: 'URL created', shortenedUrl: urlcreate.shortenedUrl };
    
  }
  async findOne(shortenedUrl: string) {
      const url = await this.urlModel.findOne({shortenedUrl: shortenedUrl});
      if (!url) {
        throw new HttpException({ message: 'URL not found' }, HttpStatus.NOT_FOUND);
      } else {
        return { message: 'URL found', originalUrl: url.originalUrl };
      }
      
  }
}
