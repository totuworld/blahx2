import { JSONSchema6 } from 'json-schema';

const JSCDenyMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        messageId: {
          type: 'string',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
        deny: {
          type: 'boolean',
        },
      },
      required: ['uid', 'messageId', 'deny'],
      type: 'object',
    },
  },
  required: ['body'],
  type: 'object',
};

export default JSCDenyMessageReq;
