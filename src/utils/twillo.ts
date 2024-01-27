import twilio from "twilio";
import log from "./log";
import { config } from "../lib";

const accountSid = config.get("accountSid") as string;
const authToken = config.get("authToken") as string;
const virtualNumber = config.get("virtualNumber") as string;
const client = twilio(accountSid, authToken);

const makeTwilioCalls = async (phoneNumbers: string[]) => {
  try {
    for (const phoneNumber of phoneNumbers) {
      await client.calls.create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: "+91" + phoneNumber,
        from: virtualNumber,
      });

      log.info(`Call initiated to ${phoneNumber}`);
    }
  } catch (error) {
    log.error("Error making Twilio calls:" + (error as Error).message);
  }
};

export { makeTwilioCalls };
