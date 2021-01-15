import {
  HttpService,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  Application,
  ApplicationDocument,
} from 'src/schemas/application.schema';
import { Logger } from 'winston';
import { CreateAppDto } from './dto/CreateAppDto.dto';
import { EditAppDto } from './dto/EditAppDto.dto';
import { InstagramTokenDto } from './dto/InstagramTokenDto';

@Injectable()
export class ApplicationsService {
  constructor(
    private httpService: HttpService,
    @InjectModel(Application.name) private appModel: Model<ApplicationDocument>,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async getAll() {
    return this.appModel.find().exec();
  }

  async get(id: string) {
    const app = await this.appModel.findOne({ _id: id }).exec();
    if (!app) {
      throw new NotFoundException();
    }
    return app;
  }

  async getToken(name: string) {
    const app = await this.appModel.findOne({ name }).exec();
    if (!app) {
      throw new NotFoundException();
    }
    return app.token;
  }

  async create(newAppDto: CreateAppDto) {
    const createdApp = new this.appModel(newAppDto);
    return createdApp.save();
  }

  async edit(id: string, updatedApp: EditAppDto) {
    const app = await this.get(id);
    app.name = this.transformName(updatedApp.name);
    app.token = updatedApp.token || app.token;
    return app.save();
  }

  transformName(name: string) {
    return name.toLowerCase().replace(/\s/, '-');
  }

  async delete(id: string) {
    const app = await this.get(id);
    return app.delete();
  }

  /**
   * Refresh token of given app by a request to Instagram API
   * https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens/
   * @param app - app whose token needs to be refreshed
   */
  async refreshToken(app: ApplicationDocument) {
    try {
      const response = await this.httpService
        .get<InstagramTokenDto>(
          `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${app.token}`,
        )
        .toPromise();

      app.token = response.data.access_token;
      await app.save();

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
