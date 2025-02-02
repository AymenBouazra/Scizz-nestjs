import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './schema/url.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from 'src/auth/schema/auth.schema';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'src/jwt.payload';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    @InjectModel(Auth.name) private authModel: Model<Auth>
  ) {}
  async create(body: CreateUrlDto) {
    const { originalUrl, token } = body;
    const urlExists = await this.urlModel.findOne({ originalUrl });
    if (urlExists) {
      throw new HttpException({ message: 'URL already exists', shortenedUrl: urlExists.shortenedUrl }, HttpStatus.BAD_REQUEST);
    }
    
    const urlcreate = await this.urlModel.create({ originalUrl });
    await this.urlModel.findOneAndUpdate({ originalUrl }, { $set: { shortenedUrl: process.env.CORS_ORIGIN +'/url/'+ urlcreate.shortUrlId} });
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const { id } = decodedToken;
      await this.authModel.findByIdAndUpdate(id, { $push: { urlIds: urlcreate._id } }, { new: true });
    }
    return  { message: 'URL created', shortenedUrl: process.env.CORS_ORIGIN +'/url/'+ urlcreate.shortUrlId, shortUrlId: urlcreate.shortUrlId };

  }
  async findOne(shortUrlId: string) {
      const url = await this.urlModel.findOne({shortUrlId: shortUrlId});
      if (!url) {
        throw new HttpException({ message: 'URL not found' }, HttpStatus.NOT_FOUND);
      } else { 
        await this.urlModel.findByIdAndUpdate(url._id, { $set: { clicks: url.clicks + 1 } });
        return { message: 'URL found', originalUrl: url.originalUrl };
      }
  }

  async removeUrlFromUser( urlId: string, token: string) {
    if (token) {      
      const decodedToken = jwtDecode<JwtPayload>(token);
      const { id } = decodedToken;
      
      const user = await this.authModel.findById(id).lean().exec();
      if (user) {
        const index = user.urlIds.findIndex(url => url.toString() === urlId);
        if (index !== -1) {
          user.urlIds.splice(index, 1);
          await this.authModel.findByIdAndUpdate(id, { $pull: { urlIds: urlId } }).lean();
          await this.urlModel.findByIdAndDelete(urlId);
          return new HttpException({ message: 'URL removed', user }, HttpStatus.OK);
        } else {
          return new HttpException({ message: 'URL not found' }, HttpStatus.NOT_FOUND);
        }
      } else {
        return new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
      }
    } else {
      return new HttpException({ message: 'No token provided' }, HttpStatus.BAD_REQUEST);
    }
  }
}
