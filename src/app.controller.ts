import { Controller, Get, Post, Body, Param, Res, Render, Header, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { User, UserAuth } from './model/user.interface';
import { HttpAppResponse } from './model/response.interface';

@Controller()
export class HomeController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getIndex() {
    return { 
      title: 'Nest API', 
      subtitle: 'The Nest framework playground',
      chat: [
        { person: 'Jonnhy' },
        { person: 'Jack' }
      ]
    };
  }

}

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUser(): User[] {
    return this.appService.getUser();
  }

  @Get('notifications')
  @Header('Content-Type', 'text/event-stream')
  @Header('Connection', 'keep-alive')
  @Header('Cache-Control', 'no-cache')
  getNotifications(@Req() request, @Res() response): any {
    this.appService.subscribeNotifications(request, response);
  }

  @Post('notifications')
  addNotification(@Body() message) {
    return this.appService.sendNotifications(message)
  }

  @Get('me')
  getMe(): User[] {
    return this.appService.getUser();
  }

  @Get(':username')
  getToken(@Param() params): HttpAppResponse {
    return this.appService.generateToken(params.username);
  }

  @Post()
  addUser(@Body() user: User) {
    return this.appService.addUser(user)
  }

  @Post('login')
  login(@Body() auth: UserAuth, @Res() response): HttpAppResponse {
    return this.appService.loginAdmin(auth, response);
  }

}
