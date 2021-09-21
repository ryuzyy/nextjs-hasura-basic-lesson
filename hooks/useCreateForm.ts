import { useState, useCallback, ChangeEvent, FormEvent} from "react"
import { useMutation } from "@apollo/client"
import { CREATE_USER } from "../queries/queries"
import { CreateUserMutation } from "../types/generated/graphql"

export const useCreateForm = () => {
  const [text, setText] = useState('')
  const [username, setUsername] = useState('')
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


  const handleTextChange = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  },[])

  const usernameChange = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  },[])

  const printMsg = useCallback( () => {
    console.log('Hello')
  },[])

  const handleSubmit = useCallback(async  (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try{
      await insert_users_one({
        variables: {
          name: username,
        },
      })
    } catch (err) {
      alert(err.massage)
    }
    setUsername('')
  },[username])

  return{
    text,
    handleTextChange,
    username,
    usernameChange,
    handleSubmit,
    printMsg,
  }
}
