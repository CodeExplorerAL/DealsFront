import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  Box,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { RiSendPlaneLine } from 'react-icons/ri';
import { CiImageOn } from 'react-icons/ci';

import { CategoryContext } from './CategoryContext';
import Divider from '@mui/material/Divider';

// 錯誤訊息使用
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


function Edit() {
  const { closepage, openHint, handletext, handletext1 } = useContext(CategoryContext);

  const article = useRef();
  const title = useRef();
  const startTime = useRef();
  const endTime = useRef();
  const img = useRef();
  const refff = useRef();

  const [open, setOpen] = useState(true);
  const [place, setPlace] = useState('');
  const [off, setOff] = useState('');

  // 錯誤訊息
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  // 定義一個狀態來存放文章列表
  const [articles, setArticles] = useState([]);
  const fetchArticles = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/articles?_=${new Date().getTime()}`);
      setTimeout(() => {
        setArticles(response.data);
      }, 100); // 短暫延遲
    } catch (error) {
      console.error('獲取文章列表失敗:', error);
    }
  };
  useEffect(() => {
    fetchArticles();
  }, []);



  {/* <Edit key={new Date()} /> */ }

  const clickplace = (event) => setPlace(event.target.value);
  const clicksetoff = (event) => setOff(event.target.value);

  const formatDate = (date) => {
    if (!date) {
      return null;
    }

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return null; // 如果日期無效，返回 null
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const gogo = () => {
    const formData = new FormData();
    formData.append('title', title.current.value);
    formData.append('Article', article.current.value);
    formData.append('token', Cookies.get('token'));

    const concessionStart = formatDate(startTime.current.value);
    if (concessionStart !== null) {
      formData.append('concessionStart', concessionStart);
    }

    const concessionEnd = formatDate(endTime.current.value);
    if (concessionEnd !== null) {
      formData.append('concessionEnd', concessionEnd);
    }

    formData.append('location_tag', place);
    formData.append('product_tag', off);
    formData.append('ItemLink', refff.current.value);

    if (img.current && img.current.files[0]) {
      formData.append('itemImg', img.current.files[0]);
    }

    axios({
      url: 'http://127.0.0.1:8000/api/articles/post',
      method: 'post',
      data: formData,
    })
      .then((response) => {
        setErrorMessage(''); // 清除錯誤訊息
        openHint();
        handletext1();
        // setArticles(prevArticles => [...prevArticles, response.data]); // 手動更新文章狀態
        closepage(); // 發文成功後關閉表單頁
        fetchArticles(); // 更新文章列表
        // 等待 2 秒後刷新頁面
        setTimeout(() => {
          window.location.reload();
        }, 3500);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrorMessage(error.response?.data?.message || '發生未知錯誤');
        }
        openHint();
        handletext();
        console.log("error", error);
      });
  };


  return (
    <Box sx={{
      width: '60%',  // 預設寬度為容器的 70%
      height: '90%', // 預設高度為容器的 70%
      bgcolor: '#ffffff',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      overflowY: 'scroll',
      bottom: '5%',  // 保持距離底部 5%
      '@media (max-width: 1200px)': {  // 當螢幕寬度小於或等於 1200px 時
        width: '70%',  // 寬度為容器的 80%
        height: '90%', // 高度為容器的 85%
      },
      '@media (max-width: 800px)': {  // 當螢幕寬度小於或等於 800px 時
        width: '90%',  // 寬度為容器的 90%
        height: '80%', // 高度為容器的 80%
      },
    }}>


      {/* Snackbar 放在這裡 */}
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setErrorMessage('')} severity="success">
          {errorMessage}
        </MuiAlert>
      </Snackbar>


      {/* 其他 UI 內容 */}
      <Paper sx={{ width: '96%', m: 1, p: 1 }}>
        <Stack spacing={2} p={1}>
          {/* 標題 */}
          <TextField
            inputRef={title}
            label='*標題'
            variant='standard'
            fullWidth
            placeholder="Ex:5折！MSI GK60「機械鍵盤』3,290元 @良興購物網"
            error={!!errors.title}
            helperText={errors.title ? errors.title[0] : ''}
          />


          {/* 優惠地區、優惠類別 */}
          <Stack direction='row' spacing={2} alignItems='center'>
            <FormControl variant='outlined' fullWidth error={!!errors.location_tag}>
              <InputLabel>＊優惠地區</InputLabel>
              <Select
                value={place}
                onChange={clickplace}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250,
                    },
                  },
                }}
              >
                {[
                  '全台門市',
                  '僅限網購',
                  '網路&門市',
                  <Divider key="divider-1" />,
                  '台北',
                  '新北',
                  '桃園',
                  '台中',
                  '臺南',
                  <Divider key="divider-2" />,
                  '高雄',
                  '新竹',
                  '基隆',
                  '嘉義',
                  '苗栗',
                  '彰化',
                  '南投',
                  '雲林',
                  '屏東',
                  '宜蘭',
                  '花蓮',
                  '臺東',
                  '澎湖',
                  '金門',
                  '連江',
                ].map((item, index) =>
                  typeof item === 'string' ? (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ) : (
                    item
                  )
                )}
              </Select>
              {errors.location_tag && <span style={{ color: 'red' }}>{errors.location_tag[0]}</span>}
            </FormControl>
            <FormControl variant='outlined' fullWidth error={!!errors.product_tag}>
              <InputLabel>＊優惠類別</InputLabel>
              <Select
                value={off}
                onChange={clicksetoff}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      width: 250,
                    },
                  },
                }}
              >
                {[
                  '美食',
                  '飲料',
                  '生活',
                  '旅遊',
                  <Divider key="divider-3" />,
                  '美妝',
                  '服飾',
                  <Divider key="divider-4" />,
                  '遊戲',
                  '科技',
                  <Divider key="divider-5" />,
                  '銀行',
                  '抽獎',
                  '贈送',
                  '綜合',
                  '信用卡'
                ].map((item, index) =>
                  typeof item === 'string' ? (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ) : (
                    item
                  )
                )}
              </Select>
              {errors.product_tag && <span style={{ color: 'red', display: 'block', marginTop: 4 }}>{errors.product_tag[0]}</span>}
            </FormControl>
          </Stack>


          {/* 優惠網址 */}
          <Stack spacing={1}>
            <TextField label="優惠網址" inputRef={refff} fullWidth placeholder="請放商品網址｜如無商品網址「請跳過此格」" />
          </Stack>

          {/* 文章內容 */}
          <Stack spacing={1}>
            <TextField
              label="＊請輸入文章內容"
              multiline
              rows={10}
              inputRef={article}
              fullWidth
              error={!!errors.Article}
              helperText={errors.Article ? errors.Article[0] : ''}
            />
          </Stack>

          {/* 優惠時間 */}
          <Stack direction='row' spacing={1} alignItems='center'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* 無開始日期與優惠開始時間 */}
              <Stack direction='row' spacing={1} alignItems='center'>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      onChange={(e) => {
                        if (e.target.checked) {
                          startTime.current.value = null;
                          startTime.current.disabled = true; // 禁用 DateTimePicker
                        } else {
                          startTime.current.disabled = false; // 启用 DateTimePicker
                        }
                      }}
                    />
                  }
                  label="無開始日期"
                />
                <DateTimePicker
                  inputRef={startTime}
                  label='＊優惠開始時間'
                  ampm={true}
                  renderInput={(params) => <TextField {...params} />}
                  disableFuture={false}
                  disabled={startTime.current?.disabled} // 根据 disabled 状态禁用或启用 DateTimePicker
                />
              </Stack>
            </LocalizationProvider>
          </Stack>

          <Stack direction='row' spacing={1} alignItems='center'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* 無結束日期與優惠結束時間 */}
              <Stack direction='row' spacing={1} alignItems='center'>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      onChange={(e) => {
                        if (e.target.checked) {
                          endTime.current.value = null;
                          endTime.current.disabled = true; // 禁用 DateTimePicker
                        } else {
                          endTime.current.disabled = false; // 启用 DateTimePicker
                        }
                      }}
                    />
                  }
                  label="無結束日期"
                />
                <DateTimePicker
                  inputRef={endTime}
                  label='＊優惠結束時間'
                  ampm={true}
                  renderInput={(params) => <TextField {...params} />}
                  disableFuture={false}
                  disabled={endTime.current?.disabled} // 根据 disabled 状态禁用或启用 DateTimePicker
                />
              </Stack>
            </LocalizationProvider>
          </Stack>

        </Stack>
      </Paper>

      {/* 照片上傳&取消&發布 */}
      <Stack
        direction='row'
        sx={{
          bgcolor: 'rgba(0,0,0,0.3)',
          height: 50,
          alignItems: 'center',
          justifyContent: 'space-around',

          p: 1,
        }}

      >
        <Button sx={{ bgcolor: '#ffffff' }} onClick={() => setOpen(!open)}>
          <CiImageOn style={{ width: 20, height: 20 }} />
          <input type='file' ref={img} style={{ display: open ? 'none' : 'block' }} />
          {errors.itemImg && <span style={{ fontSize: '1rem', color: 'red' }}>{errors.itemImg[0]}</span>}
        </Button>
        <Button onClick={closepage}>取消</Button>
        <Button onClick={gogo} sx={{ bgcolor: '#ffcdd2' }}>
          <RiSendPlaneLine />
          發送
        </Button>
      </Stack>
    </Box>

  );
}

export default Edit;