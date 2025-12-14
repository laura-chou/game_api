import "dotenv/config";

import { Model, model, Schema } from "mongoose";

import { RESPONSE_MESSAGE } from "../common/constants";
import { isNullOrEmpty } from "../common/utils";

if (isNullOrEmpty(process.env.COLLECTION_HIT_MONSTERS)) {
  throw new Error(RESPONSE_MESSAGE.ENV_ERROR);
}

export interface IHitMonsters {
  player: string;
  spentTime: string;
  date: Date;
}

const hitMonstersSchema = new Schema<IHitMonsters>({
  player: {
    type: String,
    required: true
  },
  spentTime: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  versionKey: false,
  collection: process.env.COLLECTION_HIT_MONSTERS
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const HitMonsters: Model<IHitMonsters> = model(process.env.COLLECTION_HIT_MONSTERS!, hitMonstersSchema);

export default HitMonsters;