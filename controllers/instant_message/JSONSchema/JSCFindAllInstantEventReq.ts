import { JSONSchema6 } from 'json-schema';

const JSCFindAllInstantEventReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    query: {
      additionalProperties: false,
      properties: {
        uid: {
          type: 'string',
        },
      },
      required: ['uid'],
      type: 'object',
    },
  },
  required: ['query'],
  type: 'object',
};

export default JSCFindAllInstantEventReq;
