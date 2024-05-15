import * as dotenv from 'dotenv';
dotenv.config();

export type ConfigType = {
  PORT: number;
  PG_HOST: string;
  PG_PORT: number;
  PG_USER: string;
  PG_PASS: string;
  PG_DB: string;
  ACCESS_TOKEN_KEY: string;
  ACCESS_TOKEN_TIME: string;
  APP_LOGS_PATH: string;
  OPERATION_LOGS_PATH: string;
  BOT_TOKEN: string;
  GROUP_CHAT_ID: number;
};

export const config: ConfigType = {
  PORT: Number(process.env.PORT) as unknown as number,
  PG_HOST: process.env.PG_HOST as unknown as string,
  PG_PORT: Number(process.env.PG_PORT) as unknown as number,
  PG_USER: process.env.PG_USER as unknown as string,
  PG_PASS: process.env.PG_PASS as unknown as string,
  PG_DB: process.env.PG_DB as unknown as string,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY as unknown as string,
  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME as unknown as string,
  APP_LOGS_PATH: process.env.APP_LOGS_PATH as unknown as string,
  OPERATION_LOGS_PATH: process.env.OPERATION_LOGS_PATH as unknown as string,
  BOT_TOKEN: process.env.BOT_TOKEN as unknown as string,
  GROUP_CHAT_ID: Number(process.env.GROUP_CHAT_ID) as unknown as number,
};
