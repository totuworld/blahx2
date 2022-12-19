import { NextPage } from 'next';
import { Box, Flex, Heading } from '@chakra-ui/react';
import ServiceLayout from '@/components/service_layout';
import GoogleLoginButton from '@/components/google_login_button';
import { useAuth } from '@/contexts/auth_ser.context';

const IndexPage: NextPage = function () {
  const { signInWithGoogle } = useAuth();
  return (
    <ServiceLayout title="test">
      <Box maxW="md" mx="auto">
        <img src="./logo.svg" alt="메인 로고" />
        <Flex justify="center">
          <Heading>#Blah Blah</Heading>
        </Flex>
      </Box>
      <GoogleLoginButton onClick={signInWithGoogle} />
    </ServiceLayout>
  );
};

export default IndexPage;
