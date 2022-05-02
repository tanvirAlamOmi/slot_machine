import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './model/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './model/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessAuthGuard } from './common/guards/auth/jwt';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      // cache:true,
      isGlobal: true,
    }),
    UsersModule, AuthModule, 
    TypeOrmModule.forRoot({
      // type: 'mysql',
      type: 'sqlite',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: 'root',
      database: 'arbree_slot',
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      // entities: [],
      synchronize: true,
      // synchronize: true, //remove at production
    })
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    }
  ],
})
export class AppModule {}
