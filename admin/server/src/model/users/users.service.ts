import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
    private userRepository: Repository<User>) {
  }

  async create(createUserDto: CreateUserDto) : Promise<CreateUserDto>{
    return await this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ id })
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update( id, updateUserDto );
    return this.userRepository.findOne({ id });
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
