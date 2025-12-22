import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserSession } from '@thallesp/nestjs-better-auth';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserSession['user'] => {
    const request = ctx.switchToHttp().getRequest();
    return request.session.user;
  },
);
