import { JSONSchema6 } from 'json-schema';

const JSCFindUserByScreenNameReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    query: {
      additionalProperties: false,
      properties: {
        screenName: {
          description: '사용자 id 외에 별도로 사용자를 지칭할 수 있는 이름',
          type: 'string',
        },
      },
      required: ['screenName'],
      type: 'object',
    },
  },
  required: ['query'],
  type: 'object',
};

export default JSCFindUserByScreenNameReq;
