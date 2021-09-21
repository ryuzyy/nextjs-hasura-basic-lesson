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

describe(' Hasura CRUD Test Cases', () => {
  it('Should render the list of users by useQuery', async () => {
    const { page } = await getPage({
      route: '/hasura-crud',
    })
    render(page)
    expect(await screen.findByText('Hasura CRUD')).toBeInTheDocument()
    expect(await screen.findByText('Test user A')).toBeInTheDocument()
    expect(
      await screen.getByText('2021-02-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()
    expect(
      //tuBeTruthyで存在確認
      await screen.getByTestId('edit-b6137849-7f1d-c2db-e609-22056fb86db3')
    ).toBeTruthy()
    expect(
      //tuBeTruthyで存在確認
      await screen.getByTestId('delete-b6137849-7f1d-c2db-e609-22056fb86db3')
    ).toBeTruthy()

    expect(await screen.findByText('Test user B')).toBeInTheDocument()
    expect(
      await screen.getByText('2021-02-13T18:06:46.412969+00:00')
    ).toBeInTheDocument()
    expect(
      //tuBeTruthyで存在確認
      await screen.getByTestId('edit-2b07950f-9959-1bc7-834d-5656e4aeaac2')
    ).toBeTruthy()
    expect(
      //tuBeTruthyで存在確認
      await screen.getByTestId('delete-2b07950f-9959-1bc7-834d-5656e4aeaac2')
    ).toBeTruthy()
  })
})
