import { GetServerSideProps, NextPage } from 'next';
import { Avatar, Box, Button, Flex, Spacer, Text, Textarea } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { InMemberInfo } from '@/models/member/in_member_info';
import getStringValueFromQuery from '@/utils/get_value_from_query';
import { memberFindByScreenNameForClient } from '@/models/member/member.client.service';

/**
 * 각 사용자의 home
 * 프로필 이미지, 닉네임, id가 출력
 * 질문을 작성할 수 있는 text area
 *
 * 기존에 대답한 내용이 아래쪽에 보여짐
 * 각 질문에서 답변 보기를 클릭하면 상세 화면으로 진입
 */

interface Props {
  userInfo: InMemberInfo | null;
}

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }
  return (
    <Box maxW="md">
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2">
        <Box display="flex" p="6">
          <Avatar size="lg" src={userInfo.photoURL?.replace('_normal', '')} mr="2" />
          <Flex direction="column" justify="center">
            <Text fontSize="md">{userInfo.displayName}</Text>
            <Text fontSize="xs">@{userInfo.screenName}</Text>
          </Flex>
        </Box>
      </Box>
      <Box borderWidth="1px" borderRadius="lg" p="2" overflow="hidden">
        <Textarea placeholder="질문을 남겨주세요" size="sm" />
        <Flex pt="2">
          <Spacer />
          <Button leftIcon={<EmailIcon />} colorScheme="teal" variant="solid" size="sm">
            질문 남기기
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const screenName = getStringValueFromQuery({ query, field: 'screenName' });
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
  try {
    const userInfo = await memberFindByScreenNameForClient({ isServer: true, screenName });
    return {
      props: {
        userInfo: userInfo.payload ?? null,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
      },
    };
  }
};

export default UserHomePage;
