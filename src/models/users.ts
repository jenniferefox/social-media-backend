import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const userSchema = z.object({

  user_id: z.string().uuid().default(uuidv4()),
  email: z.string().email(),
  password: z.string().max(200)

});
