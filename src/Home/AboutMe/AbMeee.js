import { Divider, Grid, Stack, Typography, Tooltip, Badge, Paper, TextField, Button } from '@mui/material'
import { React, useState, useContext, useRef, useEffect } from 'react'

import { AboutmeContext, Abupdate } from './AbRouter'
// import {handleSubmit} from './AbMaterial'


export function AboutMaterial() {
    // 接收下文
    const { data } = useContext(AboutmeContext);
    // const dataforme = data && data[2] && data[2][0] ? data[2][0].PersonalProfile : "";
    const dataforname = data && data[3] ? data[3][0] : "";
    // console.log(data[3][0])
    // const name = dataforname.name? dataforname.name:''
    useEffect(() => {
    }, [dataforname])
    // 按鈕
    const [openaboutmetext, setopenaboutmetext] = useState(true)
    const [changetext, setchangetext] = useState('編輯')

    // 唯一id儲存使用者資料
    const sqlforname = useRef();
    const sqlforpassword = useRef();
    const sqlforme = useRef();



    const changeOpenmetext = () => {
        if (changetext === '編輯') {
            setopenaboutmetext(false);
            setchangetext('儲存')
        } else {
            setopenaboutmetext(true);
            setchangetext('編輯');
            Abupdate(sqlforname, sqlforpassword, sqlforme);
        }
    }

    const changeClosemetext = (prop2) => (
        setopenaboutmetext(true),
        setchangetext('編輯')
    )

    return (
        <>
            <Grid item xs={8} md={7} p={4} sx={{ bgcolor: 'white', height: 1, boxShadow: 5 }}>
                <Grid container sx={{ justifyContent: 'space-between', height: 0.05 }}>
                    <Typography variant='h5'>個人資料<Divider /></Typography>

                    <Grid item>
                        <Button onClick={changeClosemetext} sx={{ color: '#bdbdbd' }}>取消</Button>
                        <Button onClick={changeOpenmetext} >{changetext}</Button>
                    </Grid>
                </Grid>

                <Stack mt={5} spacing={2} sx={{ width: 1 }}>

                    <TextField
                        label='暱稱'
                        // defaultValue={name}
                        disabled={openaboutmetext}
                        inputRef={sqlforname}
                    />
                    <TextField
                        label='原密碼'
                        defaultValue={12345678}
                        disabled={openaboutmetext}
                        inputRef={sqlforpassword}
                        type='password'
                    />
                    <TextField
                        label='確認密碼'
                        defaultValue={12345678}
                        disabled={openaboutmetext}
                        type='password'
                    />
                    <TextField
                        label='自我介紹'
                        defaultValue={data}
                        multiline
                        rows={9}
                        disabled={openaboutmetext}
                        inputRef={sqlforme}
                    />
                </Stack>
            </Grid>
        </>
    )
}