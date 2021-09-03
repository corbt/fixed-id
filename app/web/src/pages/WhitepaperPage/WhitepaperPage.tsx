import { Box, Heading, Link, Text } from '@chakra-ui/layout'
import { routes } from '@redwoodjs/router'
import { Head, MetaTags } from '@redwoodjs/web'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import ReactMarkdown from 'react-markdown'
import remarkTOC from 'remark-toc'
import remarkSlug from 'remark-slug'
import whitepaper from './whitepaper.md'

const mdTheme = {
  h2: (props) => <Heading as="h2" size="lg" pt="8" pb="4" {...props} />,
}

const WhitepaperPage = () => {
  return (
    <>
      <Head>
        <script
          src="https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/tex-mml-chtml.js"
          type="text/javascript"
        />
      </Head>
      <MetaTags title="FixedID Whitepaper" />
      <Box as="section" bg="gray.50" px="8" pb="24" pt="12">
        <Box
          maxW="2xl"
          mx="auto"
          sx={{
            '.MathJax, pre': {
              maxWidth: '100%',
              overflowX: 'auto',
            },
          }}
        >
          <Box pb="4">
            <Link href={routes.landing()}>Home</Link>
          </Box>

          <Heading as="h1">FixedID Whitepaper</Heading>
          <Text color="gray.600" pt="4">
            Last edited: September 3, 2021
          </Text>
          <ReactMarkdown
            components={ChakraUIRenderer(mdTheme)}
            escapeHtml={false}
            remarkPlugins={[remarkTOC, remarkSlug]}
          >
            {whitepaper}
          </ReactMarkdown>
        </Box>
      </Box>
    </>
  )
}

export default WhitepaperPage
