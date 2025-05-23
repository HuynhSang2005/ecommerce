import { z } from 'zod';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config({
  path: '.env',
})


// Kiểm tra file .env có tồn tại không
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('❌ File .env không tồn tại.');
  process.exit(1);
}

// Schema validation cho environment variables
const configSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL không được để trống'),
  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET không được để trống'),
  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET không được để trống'),
  ACCESS_TOKEN_EXPIRES_IN: z.string().min(1, 'ACCESS_TOKEN_EXPIRES_IN không được để trống'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1, 'REFRESH_TOKEN_EXPIRES_IN không được để trống'),
  ADMIN_NAME: z.string().min(1, 'ADMIN_NAME không được để trống'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL không hợp lệ').min(1, 'ADMIN_EMAIL không được để trống'),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD không được để trống'),
  ADMIN_PHONE_NUMBER: z.string().min(1, 'ADMIN_PHONE_NUMBER không được để trống'),
});

const configServer = configSchema.safeParse(process.env);

if(!configServer.success) {
  console.log('Các giá trị trong file .env không hợp lệ:');
  console.log(configServer.error.format())
  process.exit(1);
}

// const configServer = plainToInstance(ConfigSchema, process.env);
// const e = validateSync(configServer)
// if (e.length > 0) {
//   console.error('❌ Lỗi cấu hình biến môi trường (.env):');
//   e.forEach((item) => {
//     const constraintsMsg = item.constraints
//       ? Object.values(item.constraints).join(', ')
//       : 'Không xác định lỗi';
//     console.error(
//       `  - ${item.property}: ${item.value === undefined ? 'Không tìm thấy hoặc undefined' : `'${item.value}'`} (${constraintsMsg})`
//     );
//   });
//   process.exit(1);
// }

const envConfig = configServer.data;
export default envConfig;
