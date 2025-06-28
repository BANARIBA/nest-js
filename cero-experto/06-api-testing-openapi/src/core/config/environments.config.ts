import 'dotenv/config';
import * as joi from 'joi';

interface EnvironmentVars {
  PORT: number;
  MONGO_URL_CONNECTION: string;
  DEFAULT_LIMIT: number,
  DEFAULT_SKIP: number,
  SECRET_KEY: string;
  JWT_EXPIRE: string;
}

const environmentVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_URL_CONNECTION: joi.string().required(),
    DEFAULT_LIMIT: joi.number().required(),
    DEFAULT_SKIP: joi.number().required(),
    SECRET_KEY: joi.string().required(),
    JWT_EXPIRE: joi.string().required(),
  })
  .unknown(true);

const { error, value } = environmentVarsSchema.validate({
  ...process.env,
});

if (error)
  throw new Error(
    `Sometime went wrong loading the environment variablees: ${error}`,
  );

const environmentVars: EnvironmentVars = value;

export const environmentVariables = {
  port: environmentVars.PORT,
  mongoUrlConnection: environmentVars.MONGO_URL_CONNECTION,
  defaultLimit: environmentVars.DEFAULT_LIMIT,
  defaultSkip: environmentVars.DEFAULT_SKIP,
  secretKey: environmentVars.SECRET_KEY,
  jwtExpire: environmentVars.JWT_EXPIRE,
};
