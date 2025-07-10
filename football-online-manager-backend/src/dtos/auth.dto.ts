import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 50
 *     AuthResponseDto:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *         message:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: integer
 *         timestamp:
 *           type: string
 *           format: date-time
 */
export class AuthDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password!: string;
}

export class AuthResponseDto {
  user!: {
    id: string;
    email: string;
    role: string;
  };
  message!: string;
} 