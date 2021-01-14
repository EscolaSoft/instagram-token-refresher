import {
  HttpService,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateAppDto } from './dto/CreateAppDto.dto';
import { EditAppDto } from './dto/EditAppDto.dto';
import { InstagramTokenDto } from './dto/InstagramTokenDto';

export interface Application {
  id: number;
  name: string;
  token: string;
  createdAt: number;
}

@Injectable()
export class ApplicationsService {
  // TODO: database
  private applications: Application[] = [
    {
      id: 0,
      name: 'lw',
      token: 'asdasd212',
      createdAt: 0,
    },
  ];

  constructor(private httpService: HttpService) {}

  async getAll() {
    return this.applications;
  }

  async get(id: number) {
    const app = this.applications.find((app) => app.id === id);
    if (!app) {
      throw new NotFoundException();
    }
    return app;
  }

  async getToken(name: string) {
    const app = this.applications.find((app) => app.name === name);
    if (!app) {
      throw new NotFoundException();
    }
    return app.token;
  }

  async create(newApp: CreateAppDto) {
    const app = {
      id: Math.round(Math.random() * 1000),
      name: newApp.name,
      token: newApp.token,
      createdAt: Date.now(),
    };
    this.applications.push(app);
    return app;
  }

  async edit(id: number, updatedApp: EditAppDto) {
    const app = await this.get(id);
    app.name = updatedApp.name;
    app.token = updatedApp.token || app.token;
    return app;
  }

  async delete(id: number) {
    this.applications = this.applications.filter((app) => app.id !== id);
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
      Logger.log(`CRON: Refreshed ${app.name} token`);
    } catch (err) {
      Logger.error(`CRON: ${app.name} refresh failed!`);
      Logger.error(err);
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async refreshTokens() {
    Logger.log('CRON: Started token refresh');
    const apps = await this.getAll();

    await Promise.all(apps.map((app) => this.refreshToken(app)));

    Logger.log('CRON: Finished token refresh');
  }
}
