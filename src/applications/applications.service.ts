import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppDto } from './dto/CreateAppDto.dto';
import { EditAppDto } from './dto/EditAppDto.dto';

export interface Application {
  id: number;
  name: string;
  token: string;
  expireAt: number;
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
      expireAt: 3600,
      createdAt: 0,
    },
  ];

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
      expireAt: 0,
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

  async refreshToken(name: string) {
    // TODO: request to https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens/
    return name;
  }
}
