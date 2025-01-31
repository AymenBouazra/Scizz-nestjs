import { Controller, Get, Post, Body,  Param, Header, } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller('shorten')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @Header('Access-Control-Allow-Origin', '*')
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }


  @Get(':shortened_id')
  @Header('Access-Control-Allow-Origin', '*')
  findOne(@Param('shortened_id') shortened_id: string) {
    return this.urlService.findOne(shortened_id);
  }
}
