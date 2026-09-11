import { ZodSchema } from "zod";

export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues.map((i: { message: string }) => i.message).join("; ");
    throw new Error(`Validation failed: ${msg}`);
  }
  return result.data;
}
