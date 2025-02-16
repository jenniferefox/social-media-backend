import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const postSchema = z.object({
  post_id: z.string().uuid().default(uuidv4()),
  title: z.string().max(100),
  content: z.string().max(500),
});

export interface Post {
  post_id: string;
  title: string;
  content: number | null;
  user_id: string;
}
