import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from './email/email.service';
import { LoginDto, RegisterDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { TokenSender } from './utils/send-token';


interface UserData
{
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

@Injectable()
export class AppService {
  
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) { }

  // register user service
  async register(registerDto: RegisterDto, response: Response)
  {
    const { name, email, password, phone_number } = registerDto;


    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist)
    {
      throw new BadRequestException('User already exist with this email!');
    }

    const phoneNumbersToCheck = [phone_number];

    const usersWithPhoneNumber = await this.prisma.user.findMany({
      where: {
        phone_number: {
          not: null,
          in: phoneNumbersToCheck,
        },
      },
    });

    if (usersWithPhoneNumber.length > 0)
    {
      throw new BadRequestException(
        'User already exist with this phone number!',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activation_token, activationCode, response };
  }

   // create activation token
   async createActivationToken(user: UserData)
   {
     const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
 
     const token = this.jwtService.sign(
       {
         user,
         activationCode,
       },
       {
         secret: this.configService.get<string>('ACTIVATION_SECRET'),
         expiresIn: '5m',
       },
     );
     return { token, activationCode };
   }

   // Login service
   async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
    }
  }

   // compare with hashed password
   async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }



}
