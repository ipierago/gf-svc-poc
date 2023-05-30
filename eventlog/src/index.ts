import { appDataSource } from "./AppDataSource"

import { subscribeBuyItemEvent, initializeEvents } from '../../shared/dist/events'
import { UserEvent } from "./entity/UserEvent";

async function main() {
  try {
    console.log("Initializing events");
    await initializeEvents();

    subscribeBuyItemEvent(async (buyItemEvent) => {
      console.log(`consumed BuyItemEvent: ${JSON.stringify(buyItemEvent)}`);
      const userEvent = await UserEvent.create({
        user_id: buyItemEvent.userId,
        text: `BuyItemEvent: ${JSON.stringify(buyItemEvent)}`
      }).save();
      console.log(`created: ${JSON.stringify(userEvent)}`);
    });

    console.log("Initializing database");
    await appDataSource.initialize();
    console.log("Database initialized")

  } catch (error) {
    console.error(error);
    throw error;
  }
}

main();
