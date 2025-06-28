export const EnvVarConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGO_URI,
  port: process.env.PORT || 3500,
  defaulLimit: process.env.DEFAULT_LIMIT || 5,
});