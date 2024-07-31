import pg from 'pg';
import { PostgresMock } from 'pgmock';

export type DbType = pg.Client;

async function createDbMockPg(): Promise<pg.Client> {
  const mock = await PostgresMock.create();
  const client = new pg.Client(mock.getNodePostgresConfig());

  await client.connect();

  const versionResult = await client.query('SELECT version()');
  console.debug(versionResult);

  return client;
}

async function createDbHack() {
  await getCreateDbReady();
  return globalThis.createDb();
}

async function createDbNwjs() {
  // SEE: https://node-postgres.com/apis/client
  const dbOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    user: 'pronto_system',
    password: 'pronto_pass',
    database: 'tea',
  };
  const pg = require('pg');
  const client = new pg.Client(dbOptions);
  await client.connect();
  return client;
}

export async function createDb(): Promise<pg.Client> {
  if (globalThis['require']) {
    console.log('Using real DB...');
    return createDbNwjs();
  } else {
    console.log('Using pgmock...');
    return createDbHack();
  }
}

// --- HACK

declare global {
  var createDbReady: any;
  var createDb: any;
}

function setCreateDbReady() {
  if (!globalThis.createDbReady) {
    globalThis.createDbReady = Promise.withResolvers();
  }

  globalThis.createDbReady.resolve(true);
}

function getCreateDbReady() {

  if (!globalThis.createDbReady) {
    globalThis.createDbReady = Promise.withResolvers();
  }

  return globalThis.createDbReady.promise;
}
