import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { InInstantEventMessageReply } from '@/models/instant_message/interface/in_instant_event_message';
import convertDateToString from '@/utils/convert_date_to_string';

interface Props {
  replyItem: InInstantEventMessageReply;
}

const InstantEventMessageReply = function ({ replyItem }: Props) {
  return (
    <Box display="flex" mt="2">
      <Box pt="2">
        <Avatar
          size="xs"
          src={
            replyItem.author ? replyItem.author.photoURL ?? 'https://bit.ly/broken-link' : 'https://bit.ly/broken-link'
          }
          mr="2"
        />
      </Box>
      <Box borderRadius="md" p="2" width="full" bg="gray.100">
        <Flex alignItems="center">
          <Text fontSize="xs">{replyItem.author ? replyItem.author.displayName : 'anonymous'}</Text>
          <Text whiteSpace="pre-line" fontSize="xs" color="gray">
            {convertDateToString(replyItem.createAt)}
          </Text>
        </Flex>
        <Text whiteSpace="pre-line" fontSize="xs">
          {replyItem.reply}
        </Text>
      </Box>
    </Box>
  );
};

export default InstantEventMessageReply;
