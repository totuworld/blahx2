import { JSONSchema6 } from 'json-schema';

const JSCDenyInstantEventMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        instantEventId: {
          type: 'string',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
        messageId: {
          type: 'string',
        },
      },
      required: ['uid', 'instantEventId', 'messageId'],
      type: 'object',
    },
  },
  required: ['body'],
  type: 'object',
};

export default JSCDenyInstantEventMessageReq;
