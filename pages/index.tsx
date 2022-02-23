import { NextPage } from 'next';
import { Box, Button, Center, Heading, SimpleGrid } from '@chakra-ui/react';
import { FaTwitter } from 'react-icons/fa';
import { Card } from '@/components/card';
import { ServiceLayout } from '@/components/containers/service_layout';
import { useAuth } from '@/contexts/auth_user.context';

/** 최초 진입 페이지
 *
 * 가입 유도 문구
 * 트위터, 구글, 페북, 애플 로그인 버튼
 *
 */
const IndexPage: NextPage = function () {
  const { signInWithGoogle, signInWithTwitter } = useAuth();
  return (
    <ServiceLayout height="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto">
        <Center marginTop="20" marginBottom="10">
          <Heading>관심을 표현해보세요</Heading>
        </Center>
        <Card>
          <SimpleGrid columns={1} spacing="3">
            <Button
              leftIcon={
                <img src="/google.svg" alt="google logo" style={{ backgroundColor: 'white', padding: '8px' }} />
              }
              bgColor="#4285F4"
              colorScheme="blue"
              color="white"
              onClick={signInWithGoogle}
            >
              Google 계정으로 시작하기
            </Button>
            <Button leftIcon={<FaTwitter />} colorScheme="twitter" onClick={signInWithTwitter}>
              Twitter 계정으로 시작하기
            </Button>
          </SimpleGrid>
        </Card>
      </Box>
    </ServiceLayout>
  );
};

export default IndexPage;
