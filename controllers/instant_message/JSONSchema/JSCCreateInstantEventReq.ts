import { JSONSchema6 } from 'json-schema';

const JSCCreateInstantEventReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
        },
        desc: {
          type: 'string',
        },
        startDate: {
          description: '질문 시작',
          type: 'string',
          format: 'date-time',
        },
        endDate: {
          description: '질문 마감',
          type: 'string',
          format: 'date-time',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
      },
      required: ['uid', 'title', 'startDate', 'endDate'],
      type: 'object',
    },
  },
  required: ['body'],
  type: 'object',
};

export default JSCCreateInstantEventReq;
