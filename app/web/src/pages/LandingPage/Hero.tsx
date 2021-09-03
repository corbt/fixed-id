import {
  Box,
  Button,
  Heading,
  Img,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import * as React from 'react'

export default function CTA() {
  return (
    <Box as="section" bg="gray.50" pt="16" pb="24">
      <Box
        maxW={{ base: 'xl', md: '7xl' }}
        mx="auto"
        px={{ base: '6', md: '8' }}
      >
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={{ base: '3rem', lg: '2rem' }}
          mt="8"
          align={{ lg: 'center' }}
          justify="space-between"
        >
          <Box flex="1" maxW={{ lg: '520px' }}>
            <Heading
              as="h1"
              size="3xl"
              mt="8"
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              <Text as="span" color="blue.600">
                FixedID:{' '}
              </Text>
              Identity for the 21st century
            </Heading>
            <Text color="gray.600" mt="4" fontSize="lg" fontWeight="medium">
              The first blockchain-registered permanent ID. Prove to sites and
              dapps that you're a unique human, and earn basic income with
              FixedCoin.
            </Text>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              align={{ md: 'flex-end' }}
              mt="8"
            >
              <Box flex="1">
                <Input
                  id="waitlistEmail"
                  name="email"
                  size="lg"
                  fontSize="md"
                  bg="white"
                  _placeholder={{ color: 'gray.400' }}
                  color="gray.900"
                  placeholder="Email"
                  focusBorderColor="blue.200"
                />
              </Box>
              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
                fontSize="md"
                px="10"
              >
                Join the Waitlist
              </Button>
            </Stack>
            <Text mt="4" color="gray.600">
              Already in the beta?{' '}
              <Link href="#" textDecoration="underline">
                Sign in
              </Link>
            </Text>
          </Box>
          <Box
            pos="relative"
            w={{ base: 'full', lg: '560px' }}
            h={{ base: 'auto', lg: '560px' }}
          >
            <Img
              w="full"
              pos="relative"
              zIndex="1"
              h={{ lg: '100%' }}
              objectFit="cover"
              src="https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8MXxhbGx8fHx8fHx8fA&ixlib=rb-1.2.1&q=80&w=1080"
              alt="Plant growing out of coins"
            />
            <Box
              pos="absolute"
              w="100%"
              h="100%"
              top="-4"
              left="-4"
              bg="gray.200"
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
