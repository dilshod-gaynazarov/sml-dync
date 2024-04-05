import * as dotenv from 'dotenv';
dotenv.config();

export type ConfigType = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  ACCESS_TOKEN_KEY: string;
  ACCESS_TOKEN_TIME: string;
  APP_LOGS_PATH: string;
  OPERATION_LOGS_PATH: string;
  BOT_TOKEN: string;
  GROUP_CHAT_ID: number;
};

export const config: ConfigType = {
  PORT: Number(process.env.PORT) as unknown as number,
  DB_HOST: process.env.DB_HOST as unknown as string,
  DB_PORT: Number(process.env.DB_PORT) as unknown as number,
  DB_USER: process.env.DB_USER as unknown as string,
  DB_PASS: process.env.DB_PASS as unknown as string,
  DB_NAME: process.env.DB_NAME as unknown as string,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY as unknown as string,
  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME as unknown as string,
  APP_LOGS_PATH: process.env.APP_LOGS_PATH as unknown as string,
  OPERATION_LOGS_PATH: process.env.OPERATION_LOGS_PATH as unknown as string,
  BOT_TOKEN: process.env.BOT_TOKEN as unknown as string,
  GROUP_CHAT_ID: Number(process.env.GROUP_CHAT_ID) as unknown as number,
};
