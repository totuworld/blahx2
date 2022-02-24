import { JSONSchema6 } from 'json-schema';

const JSCGetMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    query: {
      additionalProperties: false,
      properties: {
        messageId: {
          type: 'string',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
      },
      required: ['uid', 'messageId'],
      type: 'object',
    },
  },
  required: ['query'],
  type: 'object',
};

export default JSCGetMessageReq;
