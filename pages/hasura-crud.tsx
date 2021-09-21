import { VFC, useState, FormEvent } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_USERS,
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from '../queries/queries'
import {
  GetUsersQuery,
  CreateUserMutation,
  DeleteUserMutation,
  UpdateUserMutation,
} from '../types/generated/graphql'
import { Layout } from '../components/Layout'
import { UserItem } from '../components/UserItem'

const HasuraCRUD: VFC = () => {
  const [editedUser, setEditedUser] = useState({ id: '', name: '' })

  //READ
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  })

  //UPDATE
  const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)

  //CREATE
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    //CREATEとDELETEは処理後にcacheを自動更新してくれないので、自分でする必要がある（仕様）
    //cacheの先頭に登録したデータを追加する（更新）
    //insert_users_oneは処理したデータを格納した場所（queries.tsを参照）
    update(cache, { data: { insert_users_one } }) {
      const cacheId = cache.identify(insert_users_one)
      //cache.identify：今作ったデータのcacheIdを取得する
      cache.modify({
        //fieldsは、更新したい箇所を設定
        fields: {
          users(existringUsers, { toReference }) {
            //toReference・・・cacheIdをもとにデータを取得する関数
            return [toReference(cacheId), ...existringUsers]
          },
        },
      })
    },
  })

  //DELETE
  const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          users(existringUsers, { readField }) {
            //削除データを覗いたリストに修正している（キャッシュでは削除はしていない？）
            return existringUsers.filter(
              (user) => delete_users_by_pk.id !== readField('id', user)
            )
          },
        },
      })
    },
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    //フォームのデフォルト動作を無効化
    e.preventDefault()

    if (editedUser.id) {
      try {
        await update_users_by_pk({
          variables: {
            id: editedUser.id,
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    } else {
      try {
        await insert_users_one({
          variables: {
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    }
  }

  //データ取得できなかったら
  if (error) return <Layout title="Hasura CRUD">Error: {error.message}</Layout>

  return (
    <Layout title="Hasura CRUD">
      <p className="mb-3 font-bold">Hasura CRUD</p>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="px-3 py-2 border border-gray-300"
          placeholder="New user ?"
          type="text"
          value={editedUser.name}
          onChange={(e) =>
            setEditedUser({ ...editedUser, name: e.target.value })
          }
        />
        <button
          disabled={!editedUser.name}
          className="disabled:opacity-40 my-3 px-3 text-white bg-indigo-600 rounded-2xl focus:outline-none"
          data-testid="new"
          type="submit"
        >
          {editedUser.id ? 'Update' : 'Create'}
        </button>
      </form>

      {data?.users.map((user) => {
        return (
          <UserItem
            key={user.id}
            user={user}
            setEditedUser={setEditedUser}
            delete_users_by_pk={delete_users_by_pk}
          />
        )
      })}
    </Layout>
  )
}

export default HasuraCRUD
