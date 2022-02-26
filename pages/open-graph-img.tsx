import { Box, Img, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const OpenGraphImg: NextPage = function () {
  const { query } = useRouter();
  const printText = query.text ?? '';
  return (
    <Box width="full" bgColor="white" p="25px" borderRadius="lg">
      <Text whiteSpace="pre-line" p="4" position="absolute" fontSize="32pt">
        {printText}
      </Text>
      <Img src="/screenshot_bg.svg" alt="frame" />
    </Box>
  );
};

export default OpenGraphImg;
