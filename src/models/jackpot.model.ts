import "dotenv/config";
import mongoose, { Schema, Model } from "mongoose";

import { responseMessage } from "@/common/response";
import { isNullOrEmpty } from "@/common/utils";

interface IJackpot {
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
});

if (isNullOrEmpty(process.env.COLLECTION_JOCKPOT)) {
  throw new Error(responseMessage.ENV_ERROR);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const jackpot: Model<IJackpot> = mongoose.model(process.env.COLLECTION_JOCKPOT!, jackpotSchema);

export default jackpot;