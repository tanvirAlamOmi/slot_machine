import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersSerive: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
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

  async getTokens(user: any): Promise<{}> { //should get User type & return token type
    const payload = {
        sub: user.id, 
        info: {
            name:  user.username,
            email: user.email
        }
    }

    const accessToken = await Promise.all([
        this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
                expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_LIFESPAN'),
            },
        )
    ])

    return { 
        access_token: accessToken
    }

}

  async signup(signupDto: SignupDto) {
    const user =  await this.usersSerive.create(signupDto);
    const token = await this.getTokens(user);

    return token;
  }
  
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const token = await this.getTokens(user);

    return token;
  }

}
