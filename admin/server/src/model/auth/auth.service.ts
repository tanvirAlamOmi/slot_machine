import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersSerive: UsersService
  ){}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;     

    const user = await this.usersSerive.findOneByEmail(email);

    if (! user) throw new UnauthorizedException("email or password don't match");

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (! isPasswordMatch) throw new UnauthorizedException("email or password don't match");
     
    if(!user.isActive) throw new UnauthorizedException("User not permitted to access");

    return user;
  }

  signup(signupDto: SignupDto) {
    return this.usersSerive.create(signupDto);
  }
  
  async login(loginDto: LoginDto) {
    return await this.validateUser(loginDto);
  }

}
