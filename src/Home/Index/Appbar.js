import React, { useState, useRef, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
// mui
import { AppBar, Toolbar, IconButton, Button, Grid, Modal, InputAdornment, TextField, Typography, createTheme, ThemeProvider, CardMedia, Stack, Tooltip } from '@mui/material'
// 檔案引用
import { CategoryContext } from './CategoryContext'
import Edit from './Edit';
import AnimationHint from './animation/AnimationHint';

// 圖片
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { CiSearch } from "react-icons/ci";
import { keyframes } from '@emotion/react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';


const blink = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;
// 按鈕樣式修改
export const themeforbutton = createTheme({
    components: {
        // 普通按鈕
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '15px',
                    color: 'black',
                    backgroundColor: 'rgb(255,255,255)',
                    // border: '1px solid #9e9e9e',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        // color: 'white',
                    },
                },
            },
        },
        // 圓形按鈕
        MuiIconButton: {
            styleOverrides: {
                root: {
                    // backgroundColor: 'rgba(0,0,0,0.05)',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                    },
                },
            },
        },
        // 搜索欄
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // 滑鼠懸浮時的背景色
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black', // 焦點時的邊框色
                    },
                    '&.Mui-focused': {
                        //   backgroundColor: 'rgba(0, 0, 0, 0.1)', // 焦點時的背景色
                    }
                },
                notchedOutline: {
                    // borderRadius: '20px', // 設置邊框圓角
                },
            },
        },
    },
    palette: {
        navlinkcolor: {
            main: '#ffffff',
            dark: '#212121',
        },
    }
})

function Appbar() {
    // 搜尋欄位拿資料
    const [inputvalue, setinputvalue] = useState('')

    const search = useRef()
    const { setsearchref,
        posttoken, setposttoken,//倒讚的登入才能使用此功能
        taketoken,//點及獲取token
        closepage,//發文的關閉
        pageopen, onpenpage,//po文頁面開關

        openforHint, handleCloseHint,//提示框的開關

        dontTaketoken,//點擊首頁將值改為空字串提取全部文章

        openHint,
    } = useContext(CategoryContext)
    const searchToPHP = () => {
        setsearchref(search.current.value)
        // 判斷搜索欄有沒有輸入
        setinputvalue(search.current.value)
        // console.log(search.current.value)
    }
    // 刪除搜索欄位資料
    const deletsearch = () => {
        setinputvalue('')
        search.current.value = ''
    }
    // 點首頁時刷新搜索欄
    const refreshsearch = () => {
        setsearchref('')
    }

    const logoutToPHP = () => {
        Cookies.remove("token");
        console.log("你已成功登出");
        alert("你已成功登出");
        // 重新加載當前頁面
        window.location.reload();
    }
    // 判斷token在不在
    const [iftoken, setIftoken] = useState(Cookies.get("token"));
    // 在你的 Appbar 組件中
    const handlePostButtonClick = () => {
        if (!iftoken) {
            // 如果用戶未登錄，導向登錄頁面
            window.location.href = '/login';
            return;
        }

        // 如果是已登入的用戶，打開發文表單
        onpenpage();
    };

    // ...




    // appbar背景顏色
    // backgroundImage: 'url("./pink1.png")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity: '0.95' 
    return (
        <ThemeProvider theme={themeforbutton}>
            {/* 對話框 */}
            <Modal open={pageopen} onClose={closepage}>
                <Edit />
            </Modal>
            <Modal open={openforHint} onClose={handleCloseHint} sx={{ opacity: 0.5 }}>
                <AnimationHint />
            </Modal>
            {/* 導覽列 */}
            <AppBar sx={{ bgcolor: '#FFFFFF' }}>
                <Toolbar>


                    {/* 主內容 */}
                    <Grid container sx={{ flexWrap: 'nowrap', alignItems: 'center' }}>
                        <Grid item xs={2} >
                            {/* logo */}
                            <NavLink to='/page1'>
                                <Button onClick={() => { dontTaketoken(); refreshsearch() }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            backgroundImage: 'linear-gradient(to right,#ef9a9a, #e57373,#ef5350 )', // 正確應用漸變
                                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // 添加陰影增強對比
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent', // 確保文字顏色透明以顯示背景漸變
                                            display: 'inline' // 確保背景只覆蓋文字
                                        }}
                                    >
                                        Deals
                                    </Typography>
                                </Button>
                            </NavLink>
                        </Grid>
                        <Grid item md={4} lg={5} sx={{ display: { xs: 'none', md: 'block' }, justifyContent: 'center' }}>
                            {/* 搜尋欄 */}
                            <TextField size='small' inputRef={search} variant="outlined" sx={{ width: 1, bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: 'black', }}>
                                            <CiSearch />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {inputvalue.length > 1 ? <Button onClick={deletsearch} sx={{ bgcolor: 'rgba(0, 0, 0, 0.01)' }}><CloseOutlinedIcon /></Button> :
                                                <Button onClick={searchToPHP} sx={{ bgcolor: 'rgba(0, 0, 0, 0.01)' }}><Typography variant='subtitle2' >搜索</Typography></Button>
                                            }

                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={10} md={6} lg={5} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>

                            {/* 登入/登出按鈕 */}
                            {iftoken !== undefined ? (
                                <Button onClick={logoutToPHP} sx={{ mx: 1 }}>
                                    <Typography variant='subtitle2'>登出</Typography>
                                </Button>
                            ) : (
                                <NavLink to='/login'>
                                    <Button sx={{ mx: 1 }}>
                                        <Typography variant='subtitle2'>登入/註冊</Typography>
                                    </Button>
                                </NavLink>
                            )}


                            <Stack direction='row' spacing={1} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                {/* <NavLink to='/controller'>
                                    <IconButton >
                                        <LockPersonIcon color='navlinkcolor' />
                                    </IconButton>
                                </NavLink> */}
                                {/* po文 */}

                                <Tooltip title='發文'>
                                    <IconButton onClick={handlePostButtonClick}>
                                        <AddIcon sx={{ color: 'rgba(0,0,0,0.8)' }} />
                                    </IconButton>
                                </Tooltip>
                                {/* 關於我 */}

                                <Tooltip title='個人資料'>
                                    <NavLink to='/aboutme'>
                                        <IconButton >
                                            <PersonIcon sx={{ color: 'rgba(0,0,0,0.8)' }} />
                                        </IconButton>
                                    </NavLink>
                                </Tooltip >
                                {/* 訂閱 */}
                                {/* <Tooltip title='訂閱'>
                                    <IconButton sx={{ display: { xs: 'none', md: 'block' } }}>
                                        <NotificationsIcon sx={{ color: 'rgba(0,0,0,0.8)' }} />
                                    </IconButton>
                                </Tooltip > */}

                            </Stack>
                        </Grid>
                    </Grid>




                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
}

export default Appbar