// import {
//   registerDecorator, 
//   ValidationArguments,
//   ValidationOptions, 
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
// import { RegisterUserDto } from '../../../routes/auth/dto/auth.dto'; 

// @ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
// export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
//   validate(passwordConfirmation: string, args: ValidationArguments) {
//     // Lấy đối tượng đang được validate (chính là RegisterUserDto instance)
//     const obj = args.object as RegisterUserDto;
//     // So sánh confirmPassword (giá trị hiện tại) với password từ cùng object
//     return obj.password === passwordConfirmation;
//   }

//   defaultMessage(args: ValidationArguments) {
//     return 'Mật khẩu xác nhận không khớp.';
//   }
// }

// export function IsPasswordMatching(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [], 
//       validator: IsPasswordMatchingConstraint, 
//     });
//   };
// }

import { z } from 'zod';

export const passwordMatchingSchema = z.object({
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
  
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp.',
  path: ['confirmPassword'], // Lỗi sẽ hiển thị ở trường confirmPassword
});

export type PasswordMatchingInput = z.infer<typeof passwordMatchingSchema>;