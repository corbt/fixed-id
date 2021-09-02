import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    brand: {
      id: '#2B6CB0',
      coin: '#2F855A',
    },
    brandCoin: 'green',
  },
  components: {
    Link: {
      baseStyle: {
        textDecoration: 'underline',
      },
    },
  },
})
