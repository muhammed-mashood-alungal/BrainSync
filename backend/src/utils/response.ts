export const successResponse = (
  message: string,
  data: Record<string, any> = {}
) => ({ succes: true, message: message, ...data });
