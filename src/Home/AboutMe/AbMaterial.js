import React, { useState, useContext, useRef, useEffect } from 'react';
import { Avatar, Tooltip, IconButton, Box, Grid, List, Stack, Typography, ListSubheader, ListItemButton } from '@mui/material'
import { styled } from '@mui/material/styles';
import axios from "axios";
import Cookies from 'js-cookie';

// 連結的檔案
import { AboutMaterial } from './AbMeee'
import { AboutPost } from './AbPost'
import { AboutCollect } from './AbCollect'
import { AboutmeContext, Abupdate } from './AbRouter'
//拿文章的資料
import { CategoryContext } from '../Index/CategoryContext'

// icon
import FavoriteIcon from '@mui/icons-material/Favorite';
import PhotoCamera from '@mui/icons-material/PhotoCamera';


// 存大頭貼
const Input = styled('input')({
  display: 'none'
})

export const Material = () => {
  // 唯一id(圖片的)
  const datanameid = useRef()

  const {
    taketoken,//點及獲取token
    fetchPostBook,//執行拿資料的函數
    postbook,//new2的資料
    posttoken,//將獲取的token傳送
    whocall
  } = useContext(CategoryContext)

  // 網頁載入時執行以下函數
  useEffect(() => {
    fetchPostBook();
  }, [postbook])


  // 拿資料
  const { data } = useContext(AboutmeContext);
  const dataforgood = data && data[0] && data[0][0] ? data[0][0].Sumlike : "";
  const dataforname = data && data[3] ? data[3][0] : "";
  // console.log(dataforname)
  const texterror1 = Cookies.get('token')

  // 圖片的狀態
  const [image, setImage] = useState('../ken1.jpg');
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };


  // 切換按鈕
  const [open, setopen] = useState('abme')
  const openAboutMaterial = (prop) => (
    setopen('abme')
  )
  const openAboutCollect = (prop) => {
    setopen('abCollect');
  }
  const openAboutPost = (prop) => {
    setopen('abpost');
  }

  return (
    <>
      <Stack mt={15} direction={'row'} sx={{ justifyContent: 'center' }}>
        <Grid container sx={{ width: 1500, height: 700, justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={4} md={2} sx={{ bgcolor: 'white', height: 1, }}>
            <Stack spacing={2} p={5} sx={{ alignItems: 'center' }}>

              {/* 大頭貼 */}
              <Box sx={{ height: 80, width: 80, position: 'relative', '&:hover, &:focus': { '& .overlay': { display: 'flex' } } }}
              >
                <Avatar src={image} alt="Profile" sx={{ height: 1, width: 1, border: 1 }} />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute', top: 0, left: 0, height: 1, width: 1, backgroundColor: 'rgba(0,0,0,0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', // 使覆盖层保持圆形
                  }}>
                  <label htmlFor="icon-button-file">
                    <Input accept="image/*" id="icon-button-file" type="file" onChange={handleImageChange} />
                    <IconButton color="primary" component="span" >
                      <PhotoCamera sx={{ color: 'white' }} />
                    </IconButton>
                  </label>
                </Box>
              </Box>
              {/* 名稱 */}
              <Typography>{dataforname.name ? dataforname.name : ''}</Typography>
            </Stack>
            <Stack>
              <List sx={{ width: 0.95 }}
                component='nav'
                subheader={
                  <ListSubheader component='div'><Typography variant='subtitle1' mb={2} >列表</Typography></ListSubheader>
                }>
                <ListItemButton onClick={openAboutMaterial} >
                  <Typography variant='subtitle2'>個人資料</Typography>
                </ListItemButton>
                <ListItemButton onClick={() => { openAboutPost(); taketoken('abme') }} >
                  <Typography variant='subtitle2'>我的文章</Typography>
                </ListItemButton>
                <ListItemButton onClick={openAboutCollect} >
                  <Typography variant='subtitle2'>收藏文章</Typography>
                </ListItemButton>

              </List>
              <Grid container px={3} py={5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Tooltip title="被喜歡總數">
                  <Stack direction='row' spacing={4}>
                    <FavoriteIcon sx={{ width: 30, height: 30, color: '#d50000' }} />
                    <Typography variant='h5'>{dataforgood ? dataforgood : 0}</Typography>
                  </Stack>
                </Tooltip>

              </Grid>
            </Stack>
          </Grid>

          {(open === 'abme') ? <AboutMaterial/>:(open === 'abCollect') ? <AboutCollect/>:<AboutPost/>}


        </Grid>

      </Stack >
    </>
  )
};