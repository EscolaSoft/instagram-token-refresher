import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  // TODO: database
  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: 'password',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
