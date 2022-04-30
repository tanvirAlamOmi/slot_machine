import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './model/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [UsersModule, TypeOrmModule.forRoot({
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
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
