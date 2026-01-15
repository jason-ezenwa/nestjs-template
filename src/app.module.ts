import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FALLBACK_MONGODB_URI } from './lib/constants';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { StorageModule } from './app/storage/storage.module';
import { UserModule } from './app/user/user.module';
import { StripeModule } from './app/stripe/stripe.module';
import { WebhookModule } from './app/webhook/webhook.module';
import { EventsModule } from './app/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || FALLBACK_MONGODB_URI),
    AuthModule.forRoot({ auth: auth }),
    StorageModule,
    UserModule,
    StripeModule,
    WebhookModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
