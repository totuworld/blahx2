import { JSONSchema6 } from 'json-schema';

const JSCPostReplyMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    query: {
      additionalProperties: false,
      properties: {
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
        messageId: {
          type: 'string',
        },
      },
      required: ['uid', 'messageId'],
      type: 'object',
    },
    body: {
      additionalProperties: false,
      properties: {
        reply: {
          type: 'string',
        },
      },
      required: ['reply'],
      type: 'object',
    },
  },
  required: ['query', 'body'],
  type: 'object',
};

export default JSCPostReplyMessageReq;
