import { JSONSchema6 } from 'json-schema';

const JSCPostInstantEventMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        instantEventId: {
          type: 'string',
        },
        message: {
          type: 'string',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
      },
      required: ['uid', 'instantEventId', 'message'],
      type: 'object',
    },
  },
  required: ['body'],
  type: 'object',
};

export default JSCPostInstantEventMessageReq;
