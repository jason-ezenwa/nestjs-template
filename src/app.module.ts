import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FALLBACK_MONGODB_URI } from './lib/constants';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || FALLBACK_MONGODB_URI),
    AuthModule.forRoot({ auth: auth }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
