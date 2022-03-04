import { GetServerSideProps, NextPage } from 'next';
import { Avatar, Box, Button, Flex, Text, Textarea, useToast } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import ResizeTextarea from 'react-textarea-autosize';
import { useState } from 'react';
import { InMemberInfo } from '@/models/member/in_member_info';
import getStringValueFromQuery from '@/utils/get_value_from_query';
import { memberFindByScreenNameForClient } from '@/models/member/member.client.service';
import { ServiceLayout } from '@/components/containers/service_layout';
import { getBaseUrl } from '@/utils/get_base_url';
import { InInstantEvent } from '@/models/instant_message/interface/in_instant_event';
import InstantMessageClientService from '@/controllers/instant_message/instant_msg.client.service';

interface Props {
  host: string;
  userInfo: InMemberInfo | null;
  instantEventInfo: InInstantEvent | null;
}

const InstantEventHomePage: NextPage<Props> = function ({ userInfo, instantEventInfo }) {
  const toast = useToast();
  const [message, updateMessage] = useState('');

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }
  return (
    <ServiceLayout height="100vh" backgroundColor="gray.200">
      <Box maxW="md" mx="auto" pt="6">
        <Link href={`/${userInfo.screenName}`}>
          <a>
            <Button fontSize="sm" mb="2" leftIcon={<ChevronLeftIcon />}>
              {userInfo.screenName} 홈으로
            </Button>
          </a>
        </Link>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Box display="flex" p="6">
            <Avatar size="lg" src={userInfo.photoURL?.replace('_normal', '')} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">@{userInfo.screenName}</Text>
            </Flex>
          </Box>
        </Box>
        <Box>
          <h4>{instantEventInfo?.title}</h4>
          <Box>{instantEventInfo?.desc}</Box>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p="2" overflow="hidden" bg="white">
          <Flex>
            <Box pt="1" pr="2">
              <Avatar size="xs" src="https://bit.ly/broken-link" />
            </Box>
            <Textarea
              bg="gray.100"
              border="none"
              boxShadow="none !important"
              placeholder="익명으로 질문할 내용을 입력해주세요"
              borderRadius="md"
              resize="none"
              minH="unset"
              minRows={1}
              maxRows={7}
              overflow="hidden"
              fontSize="xs"
              mr="2"
              as={ResizeTextarea}
              value={message}
              onChange={(e) => {
                // 최대 7줄만 스크린샷에 표현되니 7줄 넘게 입력하면 제한걸어야한다.
                if (e.target.value) {
                  const lineCount = (e.target.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1) + 1;
                  if (lineCount > 7) {
                    toast({
                      title: '최대 7줄까지만 입력가능합니다',
                      position: 'top-right',
                    });
                    return;
                  }
                }
                updateMessage(e.target.value);
              }}
            />
            <Button
              disabled={message.length === 0}
              bgColor="#FFB86C"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              onClick={() => {
                // TODO: click 처리
              }}
            >
              등록
            </Button>
          </Flex>
        </Box>
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const host = getBaseUrl(true);
  const screenName = getStringValueFromQuery({ query, field: 'screenName' });
  const instantEventId = getStringValueFromQuery({ query, field: 'instantEventId' });
  if (screenName === undefined || instantEventId === undefined) {
    return {
      props: {
        host,
        userInfo: null,
        instantEventInfo: null,
      },
    };
  }
  try {
    const userInfo = await memberFindByScreenNameForClient({ isServer: true, screenName });
    if (userInfo.payload?.uid === undefined) {
      return {
        props: {
          host,
          userInfo: userInfo.payload ?? null,
          instantEventInfo: null,
        },
      };
    }
    const instantInfo = await InstantMessageClientService.get({
      uid: userInfo.payload?.uid,
      instantEventId,
      isServer: true,
    });
    return {
      props: {
        host,
        userInfo: userInfo.payload ?? null,
        instantEventInfo: instantInfo.payload ?? null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        host,
        userInfo: null,
        instantEventInfo: null,
      },
    };
  }
};

export default InstantEventHomePage;
