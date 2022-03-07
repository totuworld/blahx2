import { JSONSchema6 } from 'json-schema';

const JSCPostInstantEventMessageReplyReq: JSONSchema6 = {
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
    body: {
      additionalProperties: false,
      properties: {
        reply: {
          type: 'string',
        },
        author: {
          additionalProperties: false,
          properties: {
            displayName: {
              description: '사용자가 마음껏 변경해서 뿌릴 수 있는 이름',
              type: 'string',
            },
            photoURL: {
              type: 'string',
            },
          },
          required: ['displayName'],
        },
      },
      required: ['reply'],
      type: 'object',
    },
  },
  required: ['query', 'body'],
  type: 'object',
};

export default JSCPostInstantEventMessageReplyReq;
