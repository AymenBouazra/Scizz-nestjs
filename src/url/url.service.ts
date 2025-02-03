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
    try {
      const { originalUrl, token } = body;
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const { id } = decodedToken;
        const urlExists = await this.urlModel.findOne({ originalUrl }).lean();
        if (urlExists) {
          const user = await this.authModel.findById(id);
          const found = user?.urlIds.some(urlId => urlId.equals(urlExists._id));
  
          if (found) {
            return new HttpException(
              { message: 'This Scizz already exists', shortenedUrl: urlExists.shortenedUrl },
              HttpStatus.FOUND,
            );
          } else {
            await this.authModel.findByIdAndUpdate(
              id,
              { $push: { urlIds: urlExists._id } },
              { new: true },
            );
            return new HttpException(
              { message: 'Scizz added to your list', shortenedUrl: urlExists.shortenedUrl },
              HttpStatus.OK,
            );
          }
        } else {
          const urlCreate = await this.urlModel.create({ originalUrl });
          const shortenedUrl = `${process.env.CORS_ORIGIN}/url/${urlCreate.shortUrlId}`;
          await this.urlModel.findOneAndUpdate(
            { originalUrl },
            { $set: { shortenedUrl } },
            { new: true },
          );
          await this.authModel.findByIdAndUpdate(
            id,
            { $push: { urlIds: urlCreate._id } },
            { new: true },
          );
          return new HttpException(
            { message: 'Scizz created', shortenedUrl },
            HttpStatus.CREATED,
          );
        }
      } else {
        const urlCreate = await this.urlModel.create({ originalUrl });
        const shortenedUrl = `${process.env.CORS_ORIGIN}/url/${urlCreate.shortUrlId}`;
        await this.urlModel.findOneAndUpdate(
          { originalUrl },
          { $set: { shortenedUrl } },
          { new: true },
        );
        return new HttpException(
          { message: 'Scizz created', shortenedUrl },
          HttpStatus.CREATED,
        );
      }
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne(shortUrlId: string) {
      const url = await this.urlModel.findOne({shortUrlId: shortUrlId});
      if (!url) {
        throw new HttpException({ message: 'Scizz not found' }, HttpStatus.NOT_FOUND);
      } else { 
        await this.urlModel.findByIdAndUpdate(url._id, { $set: { clicks: url.clicks + 1 } });
        return { message: 'Scizz found', originalUrl: url.originalUrl };
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
          return new HttpException({ message: 'Scizz removed', user }, HttpStatus.OK);
        } else {
          return new HttpException({ message: 'Scizz not found' }, HttpStatus.NOT_FOUND);
        }
      } else {
        return new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
      }
    } else {
      return new HttpException({ message: 'No token provided' }, HttpStatus.BAD_REQUEST);
    }
  }
}
