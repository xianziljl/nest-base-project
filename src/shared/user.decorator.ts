import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const http = ctx.switchToHttp()
    const request = http.getRequest();
    // const response = http.getResponse()
    const user = request.user;

    return data ? user && user[data] : user;
  }
)