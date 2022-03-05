import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import convertDateToString from '@/utils/convert_date_to_string';
import { InInstantEventMessage } from '@/models/instant_message/interface/in_instant_event_message';

interface Props {
  item: InInstantEventMessage;
}

const InstantMessageItem = function ({ item }: Props) {
  return (
    <Box borderRadius="md" width="full" bg="white" boxShadow="md">
      <Box>
        <Flex pl="2" pt="2" alignItems="center">
          <Avatar size="xs" src="https://bit.ly/broken-link" />
          <Text fontSize="xx-small" ml="1">
            anonymous
          </Text>
          <Text whiteSpace="pre-line" fontSize="xx-small" color="gray.500" ml="1">
            {convertDateToString(item.createAt)}
          </Text>
        </Flex>
      </Box>
      <Box p="2">
        <Box borderRadius="md" borderWidth="1px" p="2">
          <Text whiteSpace="pre-line" fontSize="sm">
            {item.message}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default InstantMessageItem;
