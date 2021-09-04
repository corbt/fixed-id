import {
  Box,
  Button,
  Center,
  Heading,
  Img,
  Input,
  Link,
  ListItem,
  OrderedList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  TextProps,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import * as React from 'react'

const FixedCoin: React.FC<TextProps> = (props) => (
  <Text as="span" color="brand.coin" fontWeight="extrabold" {...props}>
    FixedCoin
  </Text>
)

const FixedID: React.FC<TextProps> = (props) => (
  <Text as="span" color="brand.id" fontWeight="extrabold" {...props}>
    FixedID
  </Text>
)

export default function FAQs(props: { openWaitlist: () => void }) {
  return (
    <Box
      as="section"
      bg="gray.50"
      pt="16"
      pb="24"
      fontSize="lg"
      sx={{ p: { paddingBottom: '4' } }}
    >
      <Box maxW="2xl" mx="auto" px={{ base: '6', md: '8' }}>
        <Stack spacing="12">
          <Box>
            <Heading as="h2" pb="4">
              What can I do with a <FixedID />?
            </Heading>
            <Text>
              Beyond just receiving FixedCoins, FixedIDs serve as a type of "
              <Link
                href="https://en.wikipedia.org/wiki/Proof_of_personhood"
                isExternal
              >
                proof of personhood
              </Link>
              ." Apps that have a high risk of fraud from{' '}
              <Link to="https://en.wikipedia.org/wiki/Sybil_attack" isExternal>
                sybil attacks
              </Link>{' '}
              like sockpuppeting or fake reviews may choose to require their
              users to sign up with a FixedID.
            </Text>
            <Text>
              Long term, we expect many apps to natively support FixedID-based
              sign-in. Besides ensuring each user has only one account, FixedID
              sign-in is more private than centralized SSO providers like Google
              and Facebook. It's also more ergonomic than signing in with an
              Ethereum wallet directly, since FixedID has built-in in social
              recovery so you won't get locked out if you lose your private key.
            </Text>
          </Box>
          <Box>
            <Heading as="h2" pb="4">
              What can I do with <FixedCoin />?
            </Heading>
            FixedCoins are standard{' '}
            <Link
              href="https://www.coindesk.com/tech/2021/02/09/what-is-the-erc-20-ethereum-token-standard/"
              isExternal
            >
              ERC-20 tokens
            </Link>
            , which means they can be sent to other users or traded on
            exchanges. Many crypto wallets already have built-in support for
            sending FixedCoin. Long term, we'd also like to build dedicated apps
            for sending and receiving FixedCoin-denominated payments.
          </Box>
          <Box>
            <Heading as="h2" pb="4">
              What gives <FixedCoin /> value?
            </Heading>
            <Text>
              Bitcoin itself is a powerful example of the way shared ideas can
              conjure up value out of thin air, even without government backing.
              A currency issued through basic income could potentially be seen
              as more legitimate than Bitcoin itself, and eventually accrue more
              value. This is because if properly implemented it solves the
              critical social problem of fair distribution that Bitcoin is
              silent on.
            </Text>
            <Text>
              The FixedCoin issuance rate grows slowly by a set formula intended
              to double the total supply every 30 years (once a generation). So
              in the long term, the annual inflation in supply will settle at
              about <strong>2.3%</strong>. This is actually ideal for a currency
              meant to be spent, not hoarded—many fiat currencies{' '}
              <Link
                href="https://www.federalreserve.gov/faqs/economy_14400.htm"
                isExternal
              >
                target a similar rate
              </Link>
              . And the inflation goes to an important cause—issuing the
              FixedCoin basic income!
            </Text>
          </Box>
          <Box>
            <Heading as="h2" pb="4">
              Any reason to sign up now instead of just waiting?
            </Heading>
            <Text>
              Yes! The issuance rate of FixedCoin doesn't depend on the number
              of users in the system, so as more people sign up, each person
              will get fewer coins in each period. Early adopters will get
              rewarded with larger allocations of FixedCoin in the early days
              before more users sign up.
            </Text>
            <Text>
              Also, the FixedID contract issues ID numbers sequentially,
              starting with ID 1. So the sooner you sign up, the lower your
              number will be. And low numbers are cool. 😎
            </Text>
          </Box>
          <Box>
            <Heading as="h2" textAlign="left" pb="8">
              Ok, how do I sign up?
            </Heading>
            <Text>
              Right now, we're in a closed beta while we finish building the
              tech. You can see our progress and even contribute{' '}
              <Link href="https://github.com/corbt/fixed-id" isExternal>
                here
              </Link>
              . The best way to hear when we're ready to launch is by{' '}
              <Link onClick={props.openWaitlist}>
                signing up for the waitlist
              </Link>
              .
            </Text>
            <Text pb="4">
              Once you move off the waitlist, it'll be easy to sign up for a{' '}
              <FixedID /> and start receiving <FixedCoin />. Here's what you
              need to do:
            </Text>
            <OrderedList
              spacing="3"
              sx={{
                counterReset: 'item',
                '> li': {
                  listStyleType: 'none',
                  counterIncrement: 'item',
                  margin: 0,
                  padding: '0 0 0 1.5em',
                  textIndent: '-1.5em',

                  '&:before': {
                    display: 'inlineBlock',
                    color: 'blue.600',
                    width: '1em',
                    paddingRight: '0.5em',
                    fontWeight: 'extrabold',
                    // text-align: right,
                    content: 'counter(item) "."',
                  },
                },
              }}
            >
              <ListItem>
                Sign in with a supported crypto wallet (we can help you create
                one).
              </ListItem>
              <ListItem>
                Upload your name, photo, and a short video. This is critical to
                ensure users don't try to game the system by creating multiple
                accounts.
              </ListItem>
              <ListItem>
                Submit your profile along with an{' '}
                <Popover>
                  <PopoverTrigger>
                    <Link fontWeight="bold">honesty bond</Link>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverBody>
                        If another user believes your profile is a duplicate or
                        fake, they can challenge it, and if successful redeem
                        the honesty bond.
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>{' '}
                (currently 0.01ETH, or about $30). This bond remains in the
                FixedIncome contract.
              </ListItem>
              <ListItem>Start collecting FixedCoins!</ListItem>
            </OrderedList>
            <Center pt="12">
              <Button
                size="lg"
                colorScheme="blue"
                fontSize="md"
                px="10"
                onClick={props.openWaitlist}
              >
                Join the Waitlist!
              </Button>
            </Center>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
