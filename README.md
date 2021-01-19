# Instagram Token Refresher

Simple service that auto refreshes Instagram Long-Lived Tokens (refresh is once a week)

## Installation

```bash
$ yarn
# or: npm install
```

## Running the app

```bash
# copy env file
$ cp .env.dev .env

# development
$ yarn start
# or: npm run start

# watch mode
$ yarn start:dev
# or: npm run start:dev

# production mode
$ yarn start:prod
# or: npm run start:prod
```

### Watching scss

Auto scss recompilating

```bash
$ yarn scss:watch
# or: npm run scss:watch
```

## Deployment

```bash
# build the app
$ yarn build

# copy env file
$ cp .env.prod .env

# start in production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Deploy on `heroku`

Create your heroku app in heroku panel [apps](https://dashboard.heroku.com/apps)

In settings section add Config Vars

```env
SESSION_SECRET=secret
DB_NAME=ig-token-refresher
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

Then push the app do either `main` or `master` branch with heroku CLI.

1. `heroku login`
2. `heroku git:remote -a XXX` XXX you will get from you app panel
3. `git push heroku master`

That's it - console should return URL of your app.
