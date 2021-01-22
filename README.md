# usiran-data-store
Data store and GraphQL API for the [US-Iran project](https://github.com/hyperstudio/hidden-perspectives-app)

## Getting started

In order to run this API, a live PostgreSQL database is required.

To install, run:
```
git clone https://github.com/mitaai/usiran-data-store.git
cd usiran-data-store
npm install
```
Then, make a copy of `.env.sample` and rename it to `.env` to set environment variables:

- `DATABASE_URL` (must be a valid PostgreSQL connection string)
- `AUTH_SECRET` (any string)
- `ALLOWED_ORIGINS` (must be a space-separated list of URIs) 

are all required.

Finally, run any of the scripts below.

## Available scripts

### `npm run build`
Runs type generator, transpiles TypeScript to JavaScript, and outputs GraphQL scshema.

### `npm run start`
Runs the application in production mode, serving from `localhost:4000`. You must run `npm run build` before running this script.

### `npm run dev`
Runs type generator, transpiles TypeScript to JavaScript, outputs GraphQL schema, and runs the application in development mode, serving from `localhost:4000`. 

Hot reloading of TypeScript is enabled, as this script uses `ts-node-dev`.

### `npm run dev:typecheck`
Runs `tsc` in watch mode with `--noEmit` enabled, meaning the transpiled code will not be saved. This is just for checking TypeScript errors.