import { Box, Img } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import PrintText from '@/components/print_text';

const OpenGraphImg: NextPage = function () {
  const { query } = useRouter();
  const printText = query.text ?? '';
  return (
    <Box width="full" bgColor="white" p="25px" pt="50px" borderRadius="lg">
      <PrintText printText={printText} />
      <Img src="/screenshot_bg.svg" alt="frame" />
    </Box>
  );
};

export default OpenGraphImg;
