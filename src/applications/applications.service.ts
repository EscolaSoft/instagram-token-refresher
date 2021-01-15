import {
  HttpService,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from 'winston';
import { CreateAppDto } from './dto/CreateAppDto.dto';
import { EditAppDto } from './dto/EditAppDto.dto';
import { InstagramTokenDto } from './dto/InstagramTokenDto';
import { Application } from 'src/entites/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Application)
    private appsRepository: Repository<Application>,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async getAll() {
    return this.appsRepository.find();
  }

  async get(id: string) {
    const app = await this.appsRepository.findOne(id);
    if (!app) {
      throw new NotFoundException();
    }
    return app;
  }

  async getToken(name: string) {
    const app = await this.appsRepository.findOne({ where: { name } });
    if (!app) {
      throw new NotFoundException();
    }
    return app.token;
  }

  async create(newAppDto: CreateAppDto) {
    newAppDto.name = this.transformName(newAppDto.name);
    const newApp = this.appsRepository.create(newAppDto);
    return this.appsRepository.save(newApp);
  }

  async edit(id: string, updatedApp: EditAppDto) {
    const app = await this.get(id);
    app.name = this.transformName(updatedApp.name);
    app.token = updatedApp.token || app.token;
    return this.appsRepository.update(app.id, app);
  }

  transformName(name: string) {
    return name.toLowerCase().replace(/\s/, '-');
  }

  async delete(id: string) {
    return this.appsRepository.delete(id);
  }

  /**
   * Refresh token of given app by a request to Instagram API
   * https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens/
   * @param app - app whose token needs to be refreshed
   */
  async refreshToken(app: Application) {
    try {
      const response = await this.httpService
        .get<InstagramTokenDto>(
          `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${app.token}`,
        )
        .toPromise();

      app.token = response.data.access_token;
      await this.appsRepository.update(app.id, app);

      this.logger.info(`CRON: ${app.name} refresh successfull`);
    } catch (err) {
      this.logger.error(`CRON: ${app.name} refresh failed!`);
      this.logger.error(err.toString());
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async refreshTokens() {
    this.logger.info('CRON: Started token refresh');
    const apps = await this.getAll();

    await Promise.all(apps.map((app) => this.refreshToken(app)));

    this.logger.info('CRON: Finished token refresh');
  }
}
