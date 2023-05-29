#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:30000';

const program = new Command();

program.version('0.0.1');

program
  .command('ls')
  .description('list the contents of the system')
  .action(async () => {
    try {
      const marketplaceItemRes = await axios.get(`${BACKEND_URL}/marketplace/item`);
      const { marketplaceItems } = marketplaceItemRes.data;
      console.log(`marketplaceItems: ${JSON.stringify(marketplaceItems)}`);

      const itemRes = await axios.get(`${BACKEND_URL}/item`);
      const { items } = itemRes.data;
      console.log(`items: ${JSON.stringify(items)}`);

      const userRes = await axios.get(`${BACKEND_URL}/user`);
      const { users } = userRes.data;
      console.log(`users: ${JSON.stringify(users)}`);

      const userItemRes = await axios.get(`${BACKEND_URL}/user/item`);
      const { userItems } = userItemRes.data;
      console.log(`userItems: ${JSON.stringify(userItems)}`);

    } catch (error) {
      console.error(error);

    }
  });

program
  .command('create-user <name>')
  .description('create a new user')
  .action(async (name: string) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/create`, { name });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  });


program
  .command('create-item <name> <cost>')
  .description('create an item')
  .action(async (name: string, cost: number) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/item/create`, { name, cost });
      const { itemId } = res.data;
      console.log(`itemId: ${itemId}`);
    } catch (error) {
      console.error(error);
    }
  })

program
  .command('create-marketplace-item <itemId> <count>')
  .description('create a marketplace item')
  .action(async (itemId: number, count: number) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/marketplace/item/create`, { itemId, count });
      const { marketplaceItemId } = res.data;
      console.log(`marketplaceItemId: ${marketplaceItemId}`);
    } catch (error) {
      console.error(error);
    }
  })


program
  .command('create-user-item <user-id> <item-id> <count>')
  .description('create a user item')
  .action(async (userId: number, itemId: number, count: number) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/item/create`, { userId, itemId, count });
      const { userItemId } = res.data;
      console.log(`userItemId: ${userItemId}`);
    } catch (error) {
      console.error(error);
    }
  })

program
  .command('user-gxp-add <user-id> <amount>')
  .description('add gxp to a user')
  .action(async (userId: number, amount: number) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/gxp/add`, { userId, amount });
      console.log(JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
    }
  })

program
  .command('user-gxp <user-id>')
  .description('get user gxp balance')
  .action(async (userId: number) => {
    try {
      //const res = await axios.get(`${BACKEND_URL}/user/gxp/?userId=${userId}`);
      const res = await axios.get(`${BACKEND_URL}/user/gxp`, {
        params: {
          userId: userId
        }
      });
      console.log(JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
    }
  })


program
  .command('buy-marketplace-item <user-id> <item-id>')
  .description('buy a marketplace item')
  .action(async (userId: number, itemId: number) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/marketplace/item/buy`, {
        userId,
        itemId,
      });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  });

program
  .command('get-all')
  .description('get all')
  .action(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/get-all`);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  });

program.parse(process.argv);
