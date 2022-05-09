import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { response, Response } from 'express';

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

    const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
                expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_LIFESPAN'),
            },
        ),
        this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_LIFESPAN'),
            }
        )
    ])

    return { 
        accessToken,
        refreshToken,
    }

  }

  async refreshTokens(userToken: any, res) {
    const {sub, refreshToken} = userToken;
    const user = await this.usersSerive.findOne(sub);
    
    if (!user || !user.refreshToken){
      this.clearTokens(res);
      throw new ForbiddenException();
    } 
    
    const isMatched = await bcrypt.compare(refreshToken, user.refreshToken);

    if( !isMatched){

      this.clearTokens(res);
      throw new ForbiddenException();
    } 

    const tokens =  await this.getTokens(user);
    await this.updateRefreshToken(user['id'], tokens);
    
    this.setTokens(res, tokens['accessToken'], tokens['refreshToken'])
    return tokens;
  }

  async updateRefreshToken( userId: number, tokens: any) {
        
    const refreshToken = tokens ?  await this.usersSerive.bcryptHash(tokens.refreshToken) : null;
    
    await this.usersSerive.update(userId, {refreshToken});
  }

  async setTokens(res: Response, accessToken: String, refreshToken?: String){
    res.cookie('access-cookie', accessToken, {httpOnly:true,});
    if (refreshToken) res.cookie('refresh-cookie', refreshToken, {httpOnly:true,});
  }

  async clearTokens(res: Response){
    res.cookie('access-cookie', '', {httpOnly:true,});
    res.cookie('refresh-cookie', '', {httpOnly:true,});
  }

  async signup(signupDto: SignupDto) {
 
    const user =  await this.usersSerive.create(signupDto);
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user['id'], tokens);

    return tokens;
  }
  
  async login(loginDto: LoginDto, res) {
    const user = await this.validateUser(loginDto);
    
    const tokens = await this.getTokens(user);
    
    await this.updateRefreshToken(user.id, tokens);
    this.setTokens(res, tokens['accessToken'], tokens['refreshToken'])

    return tokens;
  }

}
