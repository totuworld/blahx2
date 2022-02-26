import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import Link from 'next/link';
import { InMemberInfo } from '@/models/member/in_member_info';
import getStringValueFromQuery from '@/utils/get_value_from_query';
import { memberFindByScreenNameForClient } from '@/models/member/member.client.service';
import MessageClientService from '@/controllers/message/message.client.service';
import { InMessage } from '@/models/message/in_message';
import { ServiceLayout } from '@/components/containers/service_layout';
import { useAuth } from '@/contexts/auth_user.context';
import MessageItem from '@/components/message_item';
import { getBaseUrl } from '@/utils/get_base_url';

interface Props {
  host: string;
  userInfo: InMemberInfo | null;
  item: InMessage | null;
}

const ReplyHomePage: NextPage<Props> = function ({ userInfo, item: propsItem, host }) {
  const { authUser } = useAuth();
  const [item, updateItem] = useState(propsItem);

  if (userInfo === null || item === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }
  const imgUrl = encodeURIComponent(`${host}/open-graph-img?text=${encodeURIComponent(item.message)}`);
  const fullImageURL = `${host}/api/thumbnail?path=${imgUrl}&colorScheme=light`;
  return (
    <>
      <Head>
        <meta property="og:image" content={fullImageURL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@blahx2" />
        <meta name="twitter:title" content={propsItem?.message} />
        <meta name="twitter:image" content={fullImageURL} />
      </Head>
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
          <Box mt="6">
            <MessageItem
              uid={userInfo.uid}
              screenName={userInfo.screenName}
              photoURL={userInfo.photoURL ?? ''}
              displayName={userInfo.displayName ?? ''}
              isOwner={authUser !== null && authUser.uid === userInfo.uid}
              item={item}
              onSendComplete={() => {
                MessageClientService.get({ uid: userInfo.uid, messageId: item.id }).then((resp) => {
                  if (resp.payload) {
                    updateItem(resp.payload);
                  }
                });
              }}
            />
          </Box>
        </Box>
      </ServiceLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const host = getBaseUrl(true);
  const screenName = getStringValueFromQuery({ query, field: 'screenName' });
  const qid = getStringValueFromQuery({ query, field: 'qid' });
  if (screenName === undefined || qid === undefined) {
    return {
      props: {
        host,
        userInfo: null,
        item: null,
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
          item: null,
        },
      };
    }
    const item = await MessageClientService.get({ isServer: true, uid: userInfo.payload?.uid, messageId: qid });
    return {
      props: {
        host,
        userInfo: userInfo.payload ?? null,
        item: item.payload ?? null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        host,
        userInfo: null,
        item: null,
      },
    };
  }
};

export default ReplyHomePage;
