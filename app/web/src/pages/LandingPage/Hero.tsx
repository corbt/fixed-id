import { Box, Button, Heading, Img, Link, Stack, Text } from '@chakra-ui/react'
import { routes } from '@redwoodjs/router'
import * as React from 'react'

export default function Hero(props: { openWaitlist: () => void }) {
  return (
    <Box as="section" bg="gray.50" pb="24">
      <Box
        maxW={{ base: 'xl', md: '7xl' }}
        mx="auto"
        px={{ base: '6', md: '8' }}
      >
        <Stack
          direction="row"
          spacing="4"
          color="gray.600"
          justify="flex-end"
          pt="8"
          pb="12"
        >
          <Link href={routes.whitepaper()}>Whitepaper</Link>
          <Link href="https://github.com/corbt/fixed-id" isExternal>
            Code
          </Link>
        </Stack>
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
              Identity for the twenty-first century
            </Heading>
            <Text color="gray.600" mt="4" fontSize="lg" fontWeight="medium">
              The first blockchain-registered permanent ID. Prove to sites and
              dapps that you're a unique human, and earn basic income with
              FixedCoin.
            </Text>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              align={{ md: 'center' }}
              mt="8"
            >
              <Button
                size="lg"
                colorScheme="blue"
                fontSize="md"
                px="10"
                onClick={props.openWaitlist}
              >
                Join the Waitlist
              </Button>
              <Text pl="6" color="gray.600">
                Already in the beta?{' '}
                <Link href="#" textDecoration="underline">
                  Sign in
                </Link>
              </Text>
            </Stack>
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
