import {object, string} from 'zod';

export const LoginSchema = object({
    email: string().email("Invalid email"),
    password: string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
});