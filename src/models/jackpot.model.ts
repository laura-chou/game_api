import "dotenv/config";
import mongoose, { Schema, Model } from "mongoose";

import { responseMessage } from "../../src/common/response";
import { isNullOrEmpty } from "../../src/common/utils";

export interface IJackpot {
  bonus: number
  date: Date
}

const jackpotSchema = new Schema<IJackpot>({
  bonus: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  versionKey: false,
  collection: "jackpot"
});

if (isNullOrEmpty(process.env.COLLECTION_JACKPOT)) {
  throw new Error(responseMessage.ENV_ERROR);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const Jackpot: Model<IJackpot> = mongoose.model(process.env.COLLECTION_JOCKPOT!, jackpotSchema);

export default Jackpot;