import { DataSource, DataSourceOptions, DefaultNamingStrategy } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import 'reflect-metadata';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get('DB_PORT'), 10),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  extra: {
    trustServerCertificate: true,
  },
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  namingStrategy: new DefaultNamingStrategy(),
};

export const AppDS = new DataSource(DataSourceConfig);
