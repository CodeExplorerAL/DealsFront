import React, { useRef, useState, useContext, useEffect } from 'react'
import { Grid, Paper, Typography, createTheme, ThemeProvider, Divider, Stack, IconButton, Box, Button, Tabs, Tab } from '@mui/material'
// 資料引用
import New2 from './New2'
import Listgogo from './Listgogo'
import Appbar from './Appbar';
import { BacktotheTop } from './Tools'
import Treemap from './Treemap'
import { CategoryContext } from './CategoryContext'
// 底部icon
import { CiInstagram } from "react-icons/ci";
import { CiFacebook } from "react-icons/ci";
import { FaLine } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";


const theme = createTheme({
  palette: {
    primary: {
      main: "#212121",
    },
    papercolor: {
      main: "#ebe6e5",
    }
  },
  components: {
    Paper: {
      styleOverrides: {
        elevation: '10',

      }
    }
  }
})

function Page1() {
  // 回到最上方
  const totop = useRef(null)
  const tothtop = () => {
    if (totop.current) {
      totop.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  const { selectedTab, setSelectedTab, handleTabChange,
    dontTaketoken,//點擊首頁將值改為空字串提取全部文章

  } = useContext(CategoryContext)

// 選染時執行一次資料重新拿取
  useEffect(() =>dontTaketoken(),[])
  return (
    <>
      <ThemeProvider theme={theme}>
        <Appbar />
        <Stack ref={totop} />

        {/* 熱門趨勢 */}
        <Grid container sx={{ justifyContent: 'center', mt: 10 }}>

          <Grid item xs={10}>
            <Typography mx={2} variant='h6' color='#000000'>熱門趨勢
              <Divider />
            </Typography>
            <Treemap />
          </Grid>
        </Grid>

        {/* 主框架 */}
        <Grid container mt={3} sx={{ flexWrap: 'nowrap', justifyContent: 'center' }}>
          {/* 回到最上方按鈕 */}
          <Box onClick={tothtop} sx={{ position: 'fixed', bottom: 5, right: 5, }}>
            <BacktotheTop />
          </Box>


          {/* 分類 */}
          <Grid item sm={3} md={2} sx={{ display: { xs: 'none', sm: 'block' }, mr: 1, height: 'auto', height: '102vh', pt: 1 }}   >
            <Typography variant='h6' p={2} color='#000000' >
            </Typography>
            <Listgogo />
          </Grid>


          {/* 最新文章 */}
          <Grid item xs={11} sm={8} >

            <Grid container sx={{ justifyContent: 'center' }}>
              <Tabs value={selectedTab} onChange={handleTabChange} centered>
                <Tab value="latest" label="最新文章"></Tab>
                <Tab value="hot" label="熱門文章"></Tab>
              </Tabs>
            </Grid>

            <Grid container mt={1} sx={{ boxShadow: 1, justifyContent: 'center' }}>
              <New2 />
            </Grid>

          </Grid>



          {/* footer */}
        </Grid>
        <Grid container mt={5} sx={{ bgcolor: "white", height: '15vh', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>

          <Grid item xs={8}>
            <Typography sx={{ textAlign: 'center' }} variant='h5'>關於我們</Typography>
          </Grid>

          <Grid item xs={4} >
            {/* 圖示 */}
            <Stack direction='row'>
              <IconButton sx={{ height: '50px', width: '50px' }}>
                <CiInstagram />
              </IconButton>
              <IconButton sx={{ height: '50px', width: '50px' }}>
                <CiFacebook />
              </IconButton>
              <IconButton sx={{ height: '50px', width: '50px' }}>
                <FaLine />
              </IconButton>
              <IconButton sx={{ height: '50px', width: '50px' }}>
                <CiTwitter />
              </IconButton>
            </Stack>
          </Grid>

        </Grid>
      </ThemeProvider >
    </>
  )
}

export default Page1