import pg from 'pg';

export type DbType = pg.Client;

// HACK:

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

export async function createDb(): Promise<DbType> {
  console.debug('Using pgmock...');
  await getCreateDbReady();
  return globalThis.createDb();
}
