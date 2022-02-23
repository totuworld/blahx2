import CustomServerError from './custom_server_error';

export default class BadReqError extends CustomServerError {
  constructor(message: string) {
    super({ message, statusCode: 400 });
    Object.setPrototypeOf(this, BadReqError.prototype);
  }
}
