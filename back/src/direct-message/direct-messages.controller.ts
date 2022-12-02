import {
  Controller,
  Headers,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import {
  DirectMessagesGetInterceptor,
  DirectMessagesGetLastInterceptor,
} from './direct-message.interceptor';
import { DirectMessagesService } from './direct-messages.service';

@Controller('direct_messages')
export class DirectMessagesController {
  constructor(private readonly dmService: DirectMessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('last')
  @UseInterceptors(DirectMessagesGetLastInterceptor)
  getLastMessages(@Headers('Authorization') token: string) {
    return this.dmService.getLastMessages(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseInterceptors(DirectMessagesGetInterceptor)
  getMessages(
    @Headers('Authorization') token: string,
    @Param('id') id: number,
  ) {
    return this.dmService.getMessages(token, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(DirectMessagesGetInterceptor)
  getAllMessages(@Headers('Authorization') token: string) {
    return this.dmService.getAllMessages(token);
  }
}