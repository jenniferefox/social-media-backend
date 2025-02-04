import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const userSchema = z.object({

  user_id: z.string().uuid().default(uuidv4()),
  name: z.string(),
  age: z.number().min(0).max(200)

});
