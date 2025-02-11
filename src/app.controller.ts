import { Controller, Get, Res } from '@nestjs/common'
//import { AppService } from './app.service';
import { Response } from 'express'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

@Controller()
export class AppController {
  //constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  getHello(@Res() res: Response) {
    //return this.appService.getHello(res);
    res.send(
      '<!DOCTYPE html><html><body><h1>Система управления проектами</h1>' +
        '<a href="api">Документация доступна по этой ссылке</a></body></html>'
    )
  }
}
