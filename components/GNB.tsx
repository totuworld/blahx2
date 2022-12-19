import React from 'react';
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth_ser.context';

const GNB = function () {
  const { loading, authUser, signOut, signInWithGoogle } = useAuth();

  const logInBtn = (
    <Button
      fontSize="sm"
      fontWeight="600"
      color="white"
      bg="pink.400"
      _hover={{
        bg: 'pink.300',
      }}
      onClick={signInWithGoogle}
    >
      로그인
    </Button>
  );
  const logOutBtn = (
    <Button as="a" fontWeight="400" variant="link" cursor="pointer" onClick={signOut}>
      로그아웃
    </Button>
  );

  const authInitialized = loading || authUser === null;
  return (
    <Box borderBottom="1px" borderStyle="solid" borderColor="gray.200" bgColor="#ffffff50" backdropBlur="2xl">
      <Flex minH="60px" py={{ base: 2 }} px={{ base: 4 }} align="center" maxW="md" mx="auto">
        <Spacer />
        <Box flex="1">
          <img style={{ height: '40px' }} src="/mainLogo.svg" alt="로고" />
        </Box>
        <Box>{authInitialized ? logInBtn : logOutBtn}</Box>
      </Flex>
    </Box>
  );
};

export default GNB;
