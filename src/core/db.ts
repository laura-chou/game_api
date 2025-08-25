import mongoose from "mongoose";

import { RESPONSE_MESSAGE } from "@/common/constants";
import { isNullOrEmpty } from "@/common/utils";
import { LogLevel, LogMessage, setLog } from "@/core/logger";

if (isNullOrEmpty(process.env.DBURL)) {
  throw new Error(RESPONSE_MESSAGE.ENV_ERROR);
}

export const connectDB = async(): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await mongoose.connect(process.env.DBURL!);
    setLog(LogLevel.INFO, "MongoDB connected successfully");
  } catch (error) {
    setLog(LogLevel.ERROR, `MongoDB connection error: 
      ${error instanceof Error ? error.message : LogMessage.ERROR.UNKNOWN}`);
    process.exit(1);
  }
};