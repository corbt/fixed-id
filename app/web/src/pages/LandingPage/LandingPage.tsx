import { MetaTags } from '@redwoodjs/web'
import FAQs from './FAQs'
import Features from './Features'
import Hero from './Hero'

const LandingPage = () => {
  return (
    <>
      <MetaTags
        title="FixedID: Identity for the 21st Century"
        // description="Landing description"
        /* you should un-comment description and add a unique description, 155 characters or less
        You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
      />
      <Hero />
      <Features />
      <FAQs />
    </>
  )
}

export default LandingPage
