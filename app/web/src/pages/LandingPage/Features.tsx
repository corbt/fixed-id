import { Box, Divider, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import * as CSS from 'csstype'

import * as React from 'react'
import {
  FcLock,
  FcEnteringHeavenAlive,
  FcMindMap,
  FcPrivacy,
  FcMoneyTransfer,
  FcGlobe,
  FcInTransit,
} from 'react-icons/fc'
import { RiScalesFill } from 'react-icons/ri'
import { Feature } from './Feature'

const Highlight: React.FC<{ color: CSS.Property.Color }> = (props) => (
  <Text
    as="span"
    position="relative"
    _after={{
      content: "''",
      width: 'full',
      height: '30%',
      position: 'absolute',
      bottom: 1,
      left: 0,
      bg: props.color,
      zIndex: -1,
    }}
  >
    {props.children}
  </Text>
)

export default () => (
  <Box as="section" maxW="5xl" mx="auto" py="12" px={{ base: '6', md: '8' }}>
    <Heading as="h2" textAlign="left" pb="8">
      A new kind of <Highlight color="blue.200">identity</Highlight>
    </Heading>
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      spacingX="10"
      spacingY={{ base: '8', md: '14' }}
    >
      <Feature title="Yours for life" icon={<FcEnteringHeavenAlive />}>
        Once you've registered a FixedID on the blockchain, that number is yours
        for life. Even if the FixedID organization disappeared, your identity
        would remain persisted and usable.
      </Feature>
      <Feature title="Perfect for single-sign-on" icon={<FcMindMap />}>
        You can use the crypto wallet associated with your FixedID to securely
        sign on to participating apps and websites. More secure than a username
        and password, and more private than signing in with Google or Facebook.
      </Feature>
      <Feature title="Fully private" icon={<FcPrivacy />}>
        FixedID sign-on is based on zero-knowledge proofs. Sites can tell that
        you are a real human, but can't see your FixedID number or track you
        between apps without permission.
      </Feature>
      <Feature title="Impossible to lose" icon={<FcLock />}>
        If your crypto wallet is lost or stolen, your trusted recovery contacts
        can transfer your FixedID to a new wallet. Arbitration-based recovery is
        also built in as a last resort.
      </Feature>
    </SimpleGrid>
    <Divider p="8" />
    <Heading as="h2" textAlign="right" pb="8" pt="8">
      A new kind of <Highlight color="green.200">money</Highlight>
    </Heading>
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      spacingX="10"
      spacingY={{ base: '8', md: '14' }}
    >
      <Feature title="Equitably distributed" icon={<FcGlobe />}>
        FixedCoin is continuously distributed as basic income to everyone in the
        world. This is the most level playing field possible.
      </Feature>
      <Feature
        title="Made for spending, not hoarding"
        icon={<FcMoneyTransfer />}
      >
        The FixedCoin issuance rate is designed for a long-term inflation rate
        of 2.3% a year. Economists agree that a small, stable inflation rate is
        ideal in a medium of exchange.
      </Feature>
      <Feature title="Secure and scalable" icon={<FcInTransit />}>
        FixedCoins are issued and available for transactions on an Ethereum L2
        network for world-class security and throughput.
      </Feature>
      <Feature title="No pre-mine" icon={<RiScalesFill color="#9B2C2C" />}>
        100% of all issued FixedCoins will be distributed fairly via basic
        income. FixedCoin has no pre-mine, and no coins reserved for developers
        or investors.
      </Feature>
    </SimpleGrid>
  </Box>
)
