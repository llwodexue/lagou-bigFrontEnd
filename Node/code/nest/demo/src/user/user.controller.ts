import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() query) {
    console.log(query);
    return { code: 200, message: query.name };
  }

  @Post()
  create(@Body() body) {
    console.log(body);
    return { code: 200, message: body.name };
  }

  @Get(':id')
  findId(@Param() params, @Headers() headers) {
    console.log(headers);
    return { code: 200, message: params.id };
  }
}
