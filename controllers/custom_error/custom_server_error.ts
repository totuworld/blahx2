export default class CustomServerError extends Error {
  public statusCode: number;

  public location?: string;

  constructor({ message, statusCode = 500, location }: { statusCode?: number; message: string; location?: string }) {
    super(message);
    this.statusCode = statusCode;
    this.location = location;
    Object.setPrototypeOf(this, CustomServerError.prototype);
  }

  serializeErrors(): { message: string } | string {
    return { message: this.message };
  }
}
