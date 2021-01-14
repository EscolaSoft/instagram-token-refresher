import {
  Controller,
  Get,
  Post,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';

@Controller()
export class AppController {
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
  async home(@Request() req) {
    return { user: JSON.stringify(req.user) };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  async logout(@Request() req, @Res() res) {
    req.logout();
    res.redirect('/');
  }
}
