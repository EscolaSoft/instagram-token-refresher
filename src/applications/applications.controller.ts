import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { ApplicationsService } from './applications.service';
import { CreateAppDto } from './dto/CreateAppDto.dto';
import { EditAppDto } from './dto/EditAppDto.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post(':id/delete')
  async handleDelete(@Param('id') id: string, @Res() res) {
    await this.applicationsService.delete(parseInt(id, 10));
    res.redirect('/home');
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/edit')
  async handleEdit(@Param('id') id, @Body() app: EditAppDto, @Res() res) {
    await this.applicationsService.edit(parseInt(id, 10), app);
    res.redirect('/home');
  }

  @UseGuards(AuthenticatedGuard)
  @Post('add')
  async handleAdd(@Body() app: CreateAppDto, @Res() res) {
    await this.applicationsService.create(app);
    res.redirect('/home');
  }

  @Get(':name/token')
  async getToken(@Param('name') name) {
    return {
      token: await this.applicationsService.getToken(name),
    };
  }

  @Get(':name/token.js')
  async getTokenFile(@Param('name') name, @Query('variable') variable) {
    const varName = variable || 'InstagramToken';
    return `
      const ${varName} = '${await this.applicationsService.getToken(name)}';
    `;
  }
}
