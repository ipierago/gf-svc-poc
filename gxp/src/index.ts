import * as grpc from '@grpc/grpc-js';

import { GxpService } from '@gf-svc-poc/shared';

import { AppDataSource, initDatabase } from './database';
import { startHeartbeat } from './heartbeat';
import { GxpServerImpl } from './GxpServerImpl';
import { GxpBalance } from './entity/GxpBalance';
import { GxpTransaction } from './entity/GxpTransaction';

import { subscribeBuyItemEvent, initializeEvents } from '@gf-svc-poc/shared';

const MY_DOMAIN = '0.0.0.0';
const MY_PORT = 30002;

async function main() {
  try {
    console.log('Initializing events');
    await initializeEvents();

    subscribeBuyItemEvent((buyItemEvent) => {
      console.log(`consumed BuyItemEvent: ${JSON.stringify(buyItemEvent)}`);
    });

    console.log('Initializing database');
    await initDatabase();
    console.log('Database initialized');

    const server = new grpc.Server();
    server.addService(GxpService, new GxpServerImpl());
    const addr = `${MY_DOMAIN}:${MY_PORT}`;
    console.log('calling grpc.Server.bindAsyn');
    const srvCred = grpc.ServerCredentials.createInsecure();
    console.log(`srvCred: ${JSON.stringify(srvCred)}`);
    server.bindAsync(addr, srvCred, (err, port) => {
      if (err) {
        console.error('Failed to start server:', err);
        return;
      }
      console.log(`Gxp listening on: ${addr} (${port})`);
      server.start();
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  startHeartbeat();
}

main();
