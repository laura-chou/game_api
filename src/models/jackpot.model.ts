import "dotenv/config";
import mongoose, { Schema, Model } from "mongoose";

import { isNullOrEmpty } from "../../src/common/utils";
import { RESPONSE_MESSAGE } from "../common/constants";

if (isNullOrEmpty(process.env.COLLECTION_JACKPOT)) {
  throw new Error(RESPONSE_MESSAGE.ENV_ERROR);
}

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
  collection: process.env.COLLECTION_JACKPOT
});


// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const Jackpot: Model<IJackpot> = mongoose.model(process.env.COLLECTION_JOCKPOT!, jackpotSchema);

export default Jackpot;