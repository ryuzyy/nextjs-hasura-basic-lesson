import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { getPage, initTestHelpers } from 'next-page-tester'
import { setupServer } from 'msw/node'
import { handlers } from '../mock/handlers'

//読み込めないので
process.env.NEXT_PUBLIC_HASURA_URL =
  'https://udemy-lesson-ryuzy01.hasura.app/v1/graphql'

//初期化
initTestHelpers()

//モックサーバ建てる
const server = setupServer(...handlers)

//起動
beforeAll(() => {
  server.listen()
})

//reset
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

//close
afterAll(() => {
  server.close()
})

describe('Navigation Test Cases', () => {
  it('Should route to selected page in navber', async () => {
    const { page } = await getPage({
      route: '/',
    })
    render(page)

    //Homeのテスト
    expect(await screen.findByText('Next.js + GraphQL')).toBeInTheDocument()

    //makevar-navのテスト
    userEvent.click(screen.getByTestId('makevar-nav'))
    expect(await screen.findByText('makeVar')).toBeInTheDocument()

    //fetchpolicy-navのテスト
    userEvent.click(screen.getByTestId('fetchpolicy-nav'))
    expect(await screen.findByText('Hasura main page')).toBeInTheDocument()

    //crud
    userEvent.click(screen.getByTestId('crud-nav'))
    expect(await screen.findByText('Hasura CRUD')).toBeInTheDocument()

    //ssg
    userEvent.click(screen.getByTestId('ssg-nav'))
    expect(await screen.findByText('SSG+ISR')).toBeInTheDocument()

    //memo
    //ssg
    userEvent.click(screen.getByTestId('memo-nav'))
    expect(
      await screen.findByText('Custom Hook + useCallback + memo')
    ).toBeInTheDocument()

    userEvent.click(screen.getByTestId('home-nav'))
    expect(await screen.findByText('Next.js + GraphQL')).toBeInTheDocument()
  })
})
