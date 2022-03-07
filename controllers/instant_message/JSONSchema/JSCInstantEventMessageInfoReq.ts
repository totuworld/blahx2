import { JSONSchema6 } from 'json-schema';

const JSCInstantEventMessageInfoReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    query: {
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
  required: ['query'],
  type: 'object',
};

export default JSCInstantEventMessageInfoReq;
