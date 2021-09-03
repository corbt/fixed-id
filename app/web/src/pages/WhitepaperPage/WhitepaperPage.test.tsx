import { render } from '@redwoodjs/testing/web'

import WhitepaperPage from './WhitepaperPage'

describe('WhitepaperPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<WhitepaperPage />)
    }).not.toThrow()
  })
})
