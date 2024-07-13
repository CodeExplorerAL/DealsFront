import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
// 導覽
import Appbar from './Home/Index/Appbar';
// 登入登出
// import {LRRouter} from './Home/LRRouter';
import AixosLR from './Home/LoginRegister/AixosLR';
import Reset from './Home/LoginRegister/Reset';
import Forget from './Home/LoginRegister/Forget';

// 主頁
import Page1 from './Home/Index/Page1';
// 文章
import Newspage from './Home/Index/Newspage';
// 文章預覽
import New2 from './Home/Index/New2';
// 選單欄
import Listgogo from './Home/Index/Listgogo';
// 發文頁面
import Edit from './Home/Index/Edit';
// 關於我
import AbAll from './Home/AboutMe/AbAll'
import {AboutmeProvider} from './Home/AboutMe/AbRouter'
import {Material} from './Home/AboutMe/AbMaterial'
// 測試
import '@fontsource/roboto/700.css';
import Register from './Home/Apptest/App'
import {TakePostapi,TakePostProvider} from './Home/Index/AllApi/IndexAPI'
import {CategoryProvider} from './Home/Index/CategoryContext'
import ALLtest from './Home/Index/ALLtest'
import AnimationHint from './Home/Index/animation/AnimationHint';

// 控制台
// import {Homepage} from './Home/Usercontrol/Pages'




const root = ReactDOM.createRoot(document.getElementById('root'));
document.body.style.backgroundColor = '#FFFFFF';
// document.body.style.background = 'linear-gradient(to bottom, #FFFFFF, #333333)';


root.render(
  <React.StrictMode>
    <ALLtest/>
  </React.StrictMode>
);

reportWebVitals();
