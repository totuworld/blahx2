import { NextPage } from 'next';
import { Box, Button, Center, Flex, Heading } from '@chakra-ui/react';
import { FaTwitter } from 'react-icons/fa';
import getConfig from 'next/config';
import Head from 'next/head';
import { ServiceLayout } from '@/components/containers/service_layout';
import { useAuth } from '@/contexts/auth_user.context';

/** 최초 진입 페이지
 *
 * 가입 유도 문구
 * 트위터, 구글, 페북, 애플 로그인 버튼
 *
 */
const IndexPage: NextPage = function () {
  const { publicRuntimeConfig } = getConfig();
  const mainUrl = `https://${publicRuntimeConfig.mainDomain}`;
  const { signInWithTwitter } = useAuth();
  return (
    <>
      <Head>
        <meta property="og:url" content={mainUrl} />
        <meta property="og:image" content={`https://${publicRuntimeConfig.mainDomain}/main.jpg`} />
        <meta property="og:site_name" content="blahX2" />
        <meta property="og:title" content="blahX2 - 익명으로 나누는 대화" />
        <meta property="og:description" content="blahX2는 익명으로 질문을 받을 수 있어요" />
        <meta name="twitter:title" content="blahX2 - 익명으로 나누는 대화" />
        <meta name="twitter:description" content="blahX2는 익명으로 질문을 받을 수 있어요" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`https://${publicRuntimeConfig.mainDomain}/main.jpg`} />
        <meta name="twitter:image:alt" content="blahX2" />
        <meta name="twitter:url" content={mainUrl} />
        <meta name="twitter:domain" content={publicRuntimeConfig.mainDomain} />
      </Head>
      <ServiceLayout height="100vh" backgroundColor="gray.50">
        <Box maxW="md" mx="auto">
          <Center marginTop="20" marginBottom="10" p="6">
            <Box>
              <img src="/blahx2.svg" alt="hero" />
              <Flex justify="center">
                <Heading>#BlahBlah</Heading>
              </Flex>
            </Box>
          </Center>
        </Box>
        <Box width="full" pb="10" display={{ md: 'block', base: 'none' }}>
          <Center>
            <Button
              size="lg"
              mx="6"
              borderRadius="full"
              leftIcon={<FaTwitter />}
              colorScheme="twitter"
              onClick={signInWithTwitter}
            >
              Twitter 계정으로 시작하기
            </Button>
          </Center>
        </Box>
        <Box position="fixed" width="full" bottom="10" pb="10" display={{ md: 'none' }}>
          <Center>
            <Button
              size="lg"
              width="full"
              mx="6"
              borderRadius="full"
              leftIcon={<FaTwitter />}
              colorScheme="twitter"
              onClick={signInWithTwitter}
            >
              Twitter 계정으로 시작하기
            </Button>
          </Center>
        </Box>
      </ServiceLayout>
    </>
  );
};

export default IndexPage;
