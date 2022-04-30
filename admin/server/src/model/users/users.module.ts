import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';


@Module({  
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    }
  ],
  exports: [UsersService]
})
export class UsersModule {}
