/* eslint-disable react/jsx-props-no-spreading */
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

export const Card = function (props: BoxProps) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      py="8"
      px={{ base: '4', md: '10' }}
      shadow="base"
      rounded={{ sm: 'lg' }}
      {...props}
    />
  );
};
