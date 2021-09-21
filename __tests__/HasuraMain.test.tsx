import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { setupServer } from 'msw/node'
import { getPage, initTestHelpers } from 'next-page-tester'
import { handlers } from '../mock/handlers'

//読み込めないので
process.env.NEXT_PUBLIC_HASURA_URL =
  'https://udemy-lesson-ryuzy01.hasura.app/v1/graphql'

//初期化
initTestHelpers()

//起動
const server = setupServer(...handlers)

//取得
beforeAll(() => {
  server.listen()
})

//リセット
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

//クローズ
afterAll(() => {
  server.close()
})

describe('Hasura Fetch Test Cases', () => {
  it('Should render the list of users by useQuery', async () => {
    const { page } = await getPage({
      route: '/hasura-main',
    })
    render(page)
    expect(await screen.findByText('Hasura main page')).toBeInTheDocument()
    expect(await screen.findByText('Test user A')).toBeInTheDocument()
    expect(await screen.findByText('Test user B')).toBeInTheDocument()
    expect(await screen.findByText('Test user C')).toBeInTheDocument()
  })
})
