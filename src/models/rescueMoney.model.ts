import "dotenv/config";

import { Model, model, Schema } from "mongoose";

import { RESPONSE_MESSAGE } from "../common/constants";
import { isNullOrEmpty } from "../common/utils";

export interface IRescueMoney {
  player: string;
  money: string;
  date: Date;
}

const rescueMoneySchema = new Schema<IRescueMoney>({
  player: {
    type: String,
    required: true
  },
  money: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  versionKey: false
});

if (isNullOrEmpty(process.env.COLLECTION_RESCUE_MONEY)) {
  throw new Error(RESPONSE_MESSAGE.ENV_ERROR);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rescueMoney: Model<IRescueMoney> = model<IRescueMoney>(process.env.COLLECTION_RESCUE_MONEY!, rescueMoneySchema);

export default rescueMoney;