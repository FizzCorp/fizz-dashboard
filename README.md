# Fizz Dashboard

<br/>

This repository contains a backend api written in express and a single page react application that communicates with that backend. Both uses the node version `^10.20.1`

<br/>


Running the backend
=====================

### Installations
> Note: Please ensure Postgres and sequelize is installed.
```
cd server
npm install
```

### Migrations
```
sequelize db:migrate
```


### Run the backend
Development with live editing and reloading support.

```
npm run develop

```
Development when running the server locally for single page frontend app.

```
npm run start

```


### Run the tests

```
npm run test
```



Running the Frontend
=====================

### Installations
```
cd client
npm install
```

### Run the frontend
```
npm run develop
```

### Build the bundle
```
npm run build:production
```