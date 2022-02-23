import CustomServerError from './custom_error/custom_server_error';

export default function checkSupportMethod(supportMethod: string[], method?: string): void {
  if (supportMethod.indexOf(method!) === -1) {
    throw new CustomServerError({ message: '지원하지 않는 method', statusCode: 400 });
  }
}
