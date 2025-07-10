import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);
    const errors = await validate(dtoObject);
    
    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        constraints: error.constraints
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors,
        status: 400,
        timestamp: new Date().toISOString()
      });
    }
    
    req.body = dtoObject;
    next();
  };
} 