import "dotenv/config";

import { Model, model, Schema } from "mongoose";

import { RESPONSE_MESSAGE } from "../common/constants";
import { isNullOrEmpty } from "../common/utils";

export interface ITurnChess {
  character: number;
  player: string;
  score: number;
  spentTime: string;
  date: Date;
}

const turnChessSchema = new Schema<ITurnChess>({
  character: {
    type: Number,
    required: true
  },
  player: {
    type: String,
    required: true
  },
  score: {
    type: Number,
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
  collection: "turnChess"
});

if (isNullOrEmpty(process.env.COLLECTION_TURN_CHESS)) {
  throw new Error(RESPONSE_MESSAGE.ENV_ERROR);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const TurnChess: Model<ITurnChess> = model(process.env.COLLECTION_TURN_CHESS!, turnChessSchema);

export default TurnChess;