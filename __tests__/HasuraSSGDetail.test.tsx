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

describe('UserDetail Test Cases', () => {
  it('Should render the user detail pre-fetched of users by getStaticProps', async () => {
    const { page } = await getPage({
      route: '/users/b6137849-7f1d-c2db-e609-22056fb86db3',
    })
    render(page)
    expect(await screen.findByText('User detail')).toBeInTheDocument()
    expect(screen.getByText('Test user A')).toBeInTheDocument()
    expect(
      screen.getByText('2021-01-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()
    userEvent.click(screen.getByTestId('back-to-main'))
    expect(await screen.findByText('SSG+ISR')).toBeInTheDocument()
    userEvent.click(
      screen.getByTestId('link-2b07950f-9959-1bc7-834d-5656e4aeaac2')
    )
    expect(await screen.findByText('User detail')).toBeInTheDocument()
    expect(screen.getByText('Test user B')).toBeInTheDocument()
    expect(
      screen.getByText('2021-02-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()
  })
})
