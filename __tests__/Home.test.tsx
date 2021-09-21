import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Home from '../pages/index'
import { Layout } from '../components/Layout'

//読み込めないので
process.env.NEXT_PUBLIC_HASURA_URL =
  'https://udemy-lesson-ryuzy01.hasura.app/v1/graphql'

it('Should render title text', () => {
  render(<Home />)
  expect(screen.getByText('Next.js + GraphQL')).toBeInTheDocument()
})
