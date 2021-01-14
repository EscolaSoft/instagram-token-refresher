import {
  Controller,
  Get,
  Param,
  Post,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { ApplicationsService } from './applications/applications.service';

@Controller()
export class AppController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  @Render('index')
  index() {
    return {};
  }

  @UseGuards(LoginGuard)
  @Post('auth/login')
  async login(@Res() res) {
    res.redirect('/home');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('home')
  @Render('home')
  async home() {
    const apps = await this.applicationsService.getAll();
    return { apps };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('add')
  @Render('add')
  async add() {
    return {};
  }

  @UseGuards(AuthenticatedGuard)
  @Get('edit/:id')
  @Render('edit')
  async edit(@Param('id') id) {
    return {
      app: await this.applicationsService.get(parseInt(id, 10)),
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  async logout(@Request() req, @Res() res) {
    req.logout();
    res.redirect('/');
  }
}
