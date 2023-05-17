import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SchemaModule } from './schemas/schema.module';

@Module({
  imports: [
    MulterModule.registerAsync({ useFactory: () => ({ dest: './uploads' }) }),
    ConfigModule.forRoot({ envFilePath: '.local.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'uploads') }),
    UserModule,
    AuthModule,
    SchemaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
