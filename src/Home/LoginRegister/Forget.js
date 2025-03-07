import React,{useRef} from 'react'
import Appbar,{themeforbutton} from '../Index/Appbar';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Reset from './Reset'


import { ThemeProvider, createTheme, Typography, Grid, TextField, CardMedia, Divider, Stack, Button } from '@mui/material';


function Forget() {

    // 忘記密碼
    const Forgetemail = useRef();

    const ForgotToPHP = () => {
        axios({
            url: "http://127.0.0.1:8000/api/forgot-password",
            method: "post",
            data: {
                email: Forgetemail.current.value,
            }
        })
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

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
                            <Typography variant='h5'>忘記密碼</Typography>
                            <Typography variant='subtitle2'>想起帳號了嗎? 
                            <NavLink to='/login'> 點我登入</NavLink>
                            </Typography>
                            <Divider />
                            <TextField sx={{ my: 1, width: 1, }} variant="filled" type='email' label="信箱" inputRef={Forgetemail}/>
                            <Grid container m={10} sx={{ justifyContent: 'end' }}>
                                <Button variant='contained' sx={{bgcolor:'#ffbcbc'}} onClick={ForgotToPHP} >忘記密碼</Button>
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    )
}

export default Forget