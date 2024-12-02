import { z } from 'zod';

export const formSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    category: z.string().min(3).max(20),
    image: z.instanceof(File).optional(),
    pitch: z.string().min(10),
});