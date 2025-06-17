import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { FlexibleEventsSchema } from 'src/dto/event.dto';

@Injectable()
export class ValidateEventsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const result = FlexibleEventsSchema.safeParse(req.body);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.format()
      });
    }

    (req as any).body = result.data;
    next();
  }
}
