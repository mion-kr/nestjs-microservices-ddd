import { Controller, Get } from '@nestjs/common';

@Controller()
export class PostsController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'hello';
  }
}
