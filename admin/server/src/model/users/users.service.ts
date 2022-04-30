import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
    private userRepository: Repository<User>) {
  }
  
  async bcryptHash (plainText: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt();
    return await bcrypt.hash(plainText, saltOrRounds);
  }

  async create(createUserDto: CreateUserDto) : Promise<User>{
    let {password, email, ...rest} = createUserDto;

    const isUserExist = await this.userRepository.findOne({ email });

    if (isUserExist) throw new ConflictException('User already exist');

    const hash = await this.bcryptHash(password);
    return await this.userRepository.save({...rest, email, password: hash});
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
