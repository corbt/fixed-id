import { render } from '@redwoodjs/testing/web'

import LandingPage from './LandingPage'

describe('LandingPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LandingPage />)
    }).not.toThrow()
  })
})
