// cronJobs.ts
import { CronJob } from "cron";
import log from "./log";
import { updatePriority, findPhoneNumber } from "../services";
import { makeTwilioCalls } from "./twillo";

const updatePriorityCron = new CronJob("* * * * *", async () => {
  log.info("Update Priority");
  await updatePriority();
});

const callUsersCron = new CronJob("* * * * *", async () => {
  log.info("Call Users");
  const numbers = await findPhoneNumber();
  console.log(numbers);
  if (numbers) {
    await makeTwilioCalls(numbers);
  }
});

export { updatePriorityCron, callUsersCron };
