import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
  secret: `${process.env.JWT_SECRET}`,
  global: true,
  signOptions: { expiresIn: '1h' },
};

export default registerAs('JWT_SECRET', () => config);
