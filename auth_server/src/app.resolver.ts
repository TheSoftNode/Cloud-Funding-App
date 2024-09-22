import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ActivationResponse, LoginResponse, RegisterResponse } from './types/user.types';
import { ActivationDto, RegisterDto } from './dtos/user.dto';

@Resolver('User')
export class AppResolver {
  constructor(private readonly userService: AppService) {}

  @Mutation(() => RegisterResponse)
    async register(
        @Args('registerDto') registerDto: RegisterDto,
        @Context() context: { res: Response },
    ): Promise<RegisterResponse>
    {
        if (!registerDto.name || !registerDto.email || !registerDto.password)
        {
            throw new BadRequestException('Please fill the all fields');
        }

        const { activation_token, activationCode } = await this.userService.register(
            registerDto,
            context.res,
        );

        return { activation_token, activationCode };
    }

    @Mutation(() => ActivationResponse)
    async activateUser(
        @Args('activationDto') activationDto: ActivationDto,
        @Context() context: { res: Response },
    ): Promise<ActivationResponse>
    {
        return await this.userService.activateUser(activationDto, context.res);
    }

    @Mutation(() => LoginResponse)
    async Login(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<LoginResponse>
    {
        return await this.userService.Login({ email, password });
    }

}
