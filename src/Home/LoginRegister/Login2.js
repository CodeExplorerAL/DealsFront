import React, { useRef, useEffect, useState } from 'react';
import { LoginFromSql } from './AixosLR';
import { Link, NavLink } from 'react-router-dom';
import Appbar, { themeforbutton } from '../Index/Appbar';
import axios from "axios";



import { CssBaseline, Box, Typography, Grid, Fab, Paper, TextField, CardMedia, Divider, Stack, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';


function Login2() {
    const rvdata = useRef();
    const dataemail = useRef();
    const datapassword = useRef();
    // 驗證碼
    const [captchaImageUrl, setCaptchaImageUrl] = useState('');
    useEffect(() => {
        // 呼叫 API 以獲取驗證碼圖片
        captchaGetImageToPHP();
    }, []);
    const captchaGetImageToPHP = () => {
        axios({
            url: "http://127.0.0.1:8000/api/reload-captcha",
            method: "get",
        })
            .then(function (response) {
                const imgSrc = response.data.captcha;
                console.log(imgSrc);

                // 使用正則表達式來擷取 src 屬性中的 URL
                const regex = /src="([^"]+)"/;
                const match = imgSrc.match(regex);
                // console.log(match);
                if (match && match.length > 1) {
                    const imageUrl = match[1];
                    setCaptchaImageUrl(imageUrl);
                    console.log(imageUrl);
                }

                // console.log(response.data.captcha);
            })
            .catch(function (error) {
                console.error(error);
            });
    }
    // 顏色
    const theme = createTheme({
        palette: {
            primary: {
                main: "#ffb74d",
                dark: "#f57c00",
            },
        }
    })

    return (
        <>
            <Appbar />
            <ThemeProvider theme={themeforbutton}>
                <Grid container sx={{ width: 0.6, height: 0.7, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}>
                    <Grid item md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <CardMedia
                            component='img'
                            image='../LRimg.png'
                            sx={{ objectFit: 'contain', justifyContent: 'center' }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} p={8} sx={{ bgcolor: 'white', borderRadius: 1, boxShadow: 10 }}>
                        <Stack spacing={2}>
                            <Typography variant='h5'>登入</Typography>
                            <Typography variant='subtitle2'>您是新用戶嗎? <NavLink to='/register'> 點我註冊</NavLink></Typography>

                            <Divider />
                            {/* <Typography variant='subtitle1' align='lift'>帳號</Typography> */}
                            <TextField sx={{ my: 1, width: 1, }} variant="filled" inputRef={dataemail} type='email' label="信箱" />

                            {/* <Typography variant='subtitle1' align='lift'>密碼</Typography> */}
                            <TextField sx={{ my: 1, width: 1, }} variant="filled" inputRef={datapassword} type='password' label="密碼" />
                            <TextField variant="filled" type="text" inputRef={rvdata} label="驗證碼" />
                            <Stack spacing={2} direction='row'>
                                <img src={captchaImageUrl} id='abc' />
                                <Button onClick={captchaGetImageToPHP}>重新載入驗證碼</Button>
                            </Stack>
                            <Typography variant='subtitle2'>
                                <NavLink to='/forget'>忘記密碼?
                                </NavLink>
                            </Typography>
                            <Grid container m={10} sx={{ justifyContent: 'center' }}>
                                <Button variant='contained' sx={{ bgcolor: '#ffbcbc' }} onClick={() => LoginFromSql(dataemail, datapassword, rvdata)}>登入</Button>
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    )
}

export default Login2