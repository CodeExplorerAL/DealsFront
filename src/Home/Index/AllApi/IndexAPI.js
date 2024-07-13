import React, { useState, createContext, useEffect } from 'react'
import axios from "axios";
import Cookies from 'js-cookie';

export const TakePostcontext = createContext()
export function TakePostProvider({ children }) {
  // 哲楨的rank文章資料
  const [postdata, setpostdata] = useState(null)
  // 李安的全部文章資料
  const [posttime, setposttime] = useState(null)
  // News2中點擊圖片後將wid傳遞到newspage
  const [pagedata, setpagedata] = useState(null)
  // 獲取收藏文章資料
  const [collect, setcollect] = useState({});
  
  // 專屬訂閱的狀態儲存
  const [subscribedata, setsubscribedata] = useState(false)
  const changesub = () => {
    setsubscribedata(!subscribedata)
  }
  // 檢查用戶是否有對文章按過收藏
  const [checkcollectdata, setcheckcollectdata] = useState(null)
  const token = Cookies.get('token')

  // 以下是內嵌式文章
  // 獲取收藏
  const collectforpost = async (wid) => {
    if (wid) {
        try {
            const response = await axios({
                url: `http://127.0.0.1:8000/api/articles/${wid}/checkFavorite`,
                method: 'get',
                params: { token: token }
            });
            setcollect(prevCollect => ({
                ...prevCollect,
                [wid]: response.data
            }));
            return response.data.message; // 返回後端的提示訊息
        } catch (error) {
            console.log("收藏文章獲取失敗", error);
            return '收藏失敗';
        }
    }
};



const handleWidUpdate = async (wid) => {
  if (wid) {
      try {
          const response = await axios({
              url: `http://127.0.0.1:8000/api/articles/${wid}/storeTarget`,
              method: 'post',
              data: {
                  token: token
              }
          });
          collectforpost(wid);
          return response.data.message; // 返回後端的提示訊息
      } catch (error) {
          console.log("收藏文章失敗", error);
          return '收藏失敗';
      }
  }
};


  useEffect(() => {
    // 哲楨的
    axios({
      url: 'http://127.0.0.1:8000/api/rank',
      method: 'get',
    })
      .then(function (response) {
        const post = response.data.merged_data

        setpostdata(post)
        // console.log(post)
      })
      .catch(function (error) {
        console.log("文章加載失敗");
      });


    // 文章
    axios({
      url: 'http://127.0.0.1:8000/api/articles',
      method: 'get',
    })
      .then(function (response) {
        const post = Object.values(response.data)
        setposttime(post)
      })
      .catch(function (error) {
        console.log("文章加載失敗");
      });


  }, [pagedata])


  const values = {
    postdata, setpostdata,
    pagedata, setpagedata,
    posttime, setposttime,
    collect, setcollect,//收藏的狀態
    subscribedata, setsubscribedata,//點擊訂閱的狀態
    checkcollectdata, setcheckcollectdata,  // 檢查用戶是否有對文章按過收藏

    handleWidUpdate,
    collectforpost,//獲取收藏
    changesub,
}

  return (
    <TakePostcontext.Provider value={values}>
      {children}
    </TakePostcontext.Provider>
  )

}



