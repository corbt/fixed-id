import { useDisclosure } from '@chakra-ui/react'
import { MetaTags } from '@redwoodjs/web'
import FAQs from './FAQs'
import Features from './Features'
import Hero from './Hero'
import WaitlistModal from './WaitlistModal'

const LandingPage = () => {
  const waitlistModalControls = useDisclosure()

  return (
    <>
      <MetaTags
        title="FixedID: Identity for the twenty-first century"
        description="The first blockchain-registered permanent ID. Prove to sites and
        dapps that you're a unique human, and earn basic income with
        FixedCoin."
      />
      <Hero openWaitlist={waitlistModalControls.onOpen} />
      <Features />
      <FAQs openWaitlist={waitlistModalControls.onOpen} />
      <WaitlistModal controls={waitlistModalControls} />
    </>
  )
}

export default LandingPage
