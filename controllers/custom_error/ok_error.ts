import CustomServerError from './custom_server_error';

export default class OKError extends CustomServerError {
  constructor(message: string) {
    super({ message, statusCode: 200 });
    Object.setPrototypeOf(this, OKError.prototype);
  }

  serializeErrors() {
    return this.message;
  }
}
