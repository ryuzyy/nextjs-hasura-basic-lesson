import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { setupServer } from 'msw/node'
import { getPage, initTestHelpers } from 'next-page-tester'
import { handlers } from '../mock/handlers'
import userEvent from '@testing-library/user-event'

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

describe(' HasuraDetail Test Cases', () => {
  it('Should render the user detail of users by getStaticProps', async () => {
    const { page } = await getPage({
      route: '/hasura-ssg',
    })
    render(page)
    expect(await screen.findByText('SSG+ISR')).toBeInTheDocument()
    expect(await screen.getByText('Test user A')).toBeInTheDocument()
    expect(await screen.getByText('Test user B')).toBeInTheDocument()
    expect(await screen.getByText('Test user C')).toBeInTheDocument()
  })
})
