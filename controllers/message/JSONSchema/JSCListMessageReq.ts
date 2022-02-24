import { JSONSchema6 } from 'json-schema';

const JSCListMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    query: {
      additionalProperties: false,
      properties: {
        screenName: {
          type: 'string',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
        page: {
          type: 'number',
          minimum: 1,
          default: 1,
        },
        size: {
          type: 'number',
          default: 10,
          minimum: 1,
          maximum: 50,
        },
      },
      oneOf: [
        {
          required: ['screenName'],
        },
        {
          required: ['uid'],
        },
      ],
      type: 'object',
    },
  },
  required: ['query'],
  type: 'object',
};

export default JSCListMessageReq;
