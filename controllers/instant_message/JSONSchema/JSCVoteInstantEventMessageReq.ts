import { JSONSchema6 } from 'json-schema';

const JSCVoteInstantEventMessageReq: JSONSchema6 = {
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
        isUpvote: {
          type: 'boolean',
        },
      },
      required: ['uid', 'instantEventId', 'messageId', 'isUpvote'],
      type: 'object',
    },
  },
  required: ['body'],
  type: 'object',
};

export default JSCVoteInstantEventMessageReq;
