import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result =  await this.usersService.create(createUserDto);
    return {message: "User created Successfully", result};
  }

  @Get()
  async findAll() {
    const result = await this.usersService.findAll();
    return {message: "Data fetched Successfully", result};
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(+id);
    return {message: "Data fetched Successfully", result};
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateUserDto);
    return {message: "Data Updated Successfully", result}
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await  this.usersService.remove(+id);
    return {message: "Data Deleted Successfully", result}
  }
}
