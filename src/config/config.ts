import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  console.log(process.env);
  return {
    port: parseInt(process.env.PORT, 10),
    host_url: process.env.HOST,
    dbserver: {
      db: process.env.DB,
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // encrypt: process.env.DB_ENCRYPT,
      port: parseInt(process.env.DB_PORT, 10),
      schema: process.env.DB_SCHEMA,
    },
    discord: {
      idServer: process.env.DISCORD_ID_SERVER,
      adminRol: process.env.DISCORD_ID_ADMIN_ROL,
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackUrl: process.env.DISCORD_CALLBACK_URL,
    },
    jwtSecret: process.env.JWT_SECRET,
  };
});
