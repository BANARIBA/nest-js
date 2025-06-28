import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  MONGO_URI: Joi.string().required(),
  DEFAULT_LIMIT: Joi.number().default(5),
});