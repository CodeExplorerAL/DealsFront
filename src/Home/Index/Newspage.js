import React, { useState, useContext, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Paper, Divider, Stack, CardMedia, Avatar, TextField, Grid, Link } from '@mui/material';
import { TakePostcontext } from './AllApi/IndexAPI';
import { CategoryContext } from './CategoryContext';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

export default function Newspage({ closepage, children }) {
    const MSG = useRef();

    const { postdata, pagedata, posttime, toggleCollect } = useContext(TakePostcontext);
    const { loveStates, toggleHate, hateStates, toggleLove } = useContext(CategoryContext);

    const article = postdata ? postdata.find(prop => prop.WID === pagedata) : '';
    const datapost1 = posttime && posttime[0] ? posttime[0] : '沒有資料';
    const article1 = datapost1 ? datapost1.find((prop) => prop.wid == pagedata) : '';
    const postwid = article1.wid;

    const [msgdata, setmsgdata] = useState(null);
    const [authorId, setAuthorId] = useState(null);
    // 在 Newspage 函數中添加一個新的狀態來存儲用戶是否訂閱了該作者
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubscribedIcon, setIsSubscribedIcon] = useState(false);




    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/PostMessage?WID=${postwid}`)
            .then(response => {
                setmsgdata(response.data.postMessages);
                if (response.data.postMessages && response.data.postMessages.length > 0) {
                    setAuthorId(response.data.postMessages[0].author_id);
                }
            })
            .catch(error => {
                console.error('沒傳進去', error);
            });
    }, []);

    const [isLoading, setIsLoading] = useState(true); // 新增一個載入狀態


    // 使用 checkUserSubscription 函數來更新訂閱狀態
    const checkUserSubscription = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/users/${article.UID}/checkSubscription`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            setIsSubscribed(response.data.isSubscribed);
        } catch (error) {
            console.error("checkUserSubscription error:", error); // 新增這行

            console.error("檢查訂閱狀態失敗", error);
        }
    };

    // 調用 checkUserSubscription 函數以獲取初始訂閱狀態
    useEffect(() => {
        checkUserSubscription();
    }, [article.UID]);

    // 使用 useEffect 監聽 isSubscribed 狀態的變化來更新 isSubscribedIcon
    useEffect(() => {
        setIsSubscribedIcon(isSubscribed);
    }, [isSubscribed]);


    const UIDSubscription = async () => {
        if (!article.UID) {
            alert("請登入會員");
            return;
        }

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/users/${article.UID}/subscribe`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                }
            );

            const isUnsubscribed = response.data.message === '取消訂閱';

            setIsSubscribed(!isUnsubscribed);
            setIsSubscribedIcon(!isSubscribedIcon);

            alert(response.data.message);

        } catch (error) {
            console.error("訂閱操作失敗", error);
            alert("由於出現錯誤，訂閱操作失敗。");
        }
    };




    // 使用 useEffect 監聽 isSubscribed 狀態的變化來更新 isSubscribedIcon
    useEffect(() => {
        setIsSubscribedIcon(isSubscribed);
    }, [isSubscribed]);

    const MSGtosql = () => {
        axios.post('http://127.0.0.1:8000/api/PostMessage/tosql', {
            WID: article.WID,
            MSGPost: MSG.current.value,
            token: Cookies.get('token')
        })
            .then(response => {
                const userName = response.data.postmessage.user.name;
                // 成功發送評論後，將新評論加入到 msgdata 狀態中
                const currentDate = new Date();
                const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

                setmsgdata(prevMsgData => [...prevMsgData, {
                    user_name: userName,  // 使用當前使用者名稱
                    MSGPost: MSG.current.value,
                    MSGPostTime: formattedDate,  // 使用當前時間
                    // 其他需要的屬性
                }]);
                // 清除輸入框
                MSG.current.value = '';

                // 顯示發送成功的提示
                // alert('留言發送成功！');

                setTimeout(() => {
                    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100); // 延遲 100 毫秒
            })
            .catch(error => {
                console.log("文章留言發送失敗", error);
                if (error.response && error.response.data && error.response.data.error) {
                    // 從後端獲取錯誤訊息並顯示在提示框中
                    alert(error.response.data.error);
                } else {
                    // 一般錯誤訊息
                    alert('文章留言發送失敗');
                }
            });

    };

    const lastMessageRef = useRef(null);





    // 在你的 Newspage 函數內部或上面的其他函數之外定義一個新的狀態來存儲是否已收藏的狀態
    const [isFavorited, setIsFavorited] = useState(false);
    // 使用 useEffect 來檢查文章是否已收藏
    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/articles/${postwid}/checkFavorite`, {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                });
                setIsFavorited(response.data.isFavorited);
            } catch (error) {
                console.error('檢查收藏狀態失敗', error);
            }
        };

        checkFavorite();
    }, [postwid]);








    // 在你的 Newspage 函數內部或上面的其他函數之外定義 handleReport 函數
    const handleReport = () => {
        setOpenReportDialog(true);
    };
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reportContent, setReportContent] = useState('');
    const handleReportSubmit = () => {
        axios.post(
            `http://localhost:8000/api/articles/${article.WID}/report`,
            {
                ReportContent: reportContent
            },
            {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            }
        )
            .then(response => {
                alert(response.data.message);
                setOpenReportDialog(false);
                setReportContent('');
            })
            .catch(error => {
                console.error('檢舉失敗', error);
            });
    };

    const [isImageZoomed, setIsImageZoomed] = useState(false);
    // 當點擊圖片時觸發此函數來切換放大狀態
    const toggleImageZoom = () => {
        setIsImageZoomed(prevState => !prevState);
    };
    return (
        <>
            <Box sx={{
                width: '60%',
                height: '90%',
                bgcolor: '#ffffff',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                overflowY: 'scroll',
                bottom: '5%',
                '@media (max-width: 1200px)': {
                    width: '70%',
                    height: '90%',
                },
                '@media (max-width: 800px)': {
                    width: '90%',
                    height: '80%',
                },
            }}>

                <Stack direction='row' spacing={2} sx={{ bgcolor: 'white', height: 40, p: 2, alignItems: 'center', justifyContent: 'space-between', width: 1, position: 'sticky', top: 0, zIndex: 1, boxShadow: 1 }}>
                    <Stack direction='row' >
                        <Button sx={{ bgcolor: '#ef9a9a' }}>
                            <Typography variant='subtitle1'>{article.product_tag || ''}</Typography>
                        </Button>
                        <Button>
                            <Typography variant='subtitle1'>{article.location_tag || ''}</Typography>
                        </Button>
                    </Stack >
                    <Stack pr={5}>
                        <IconButton onClick={closepage} >
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Stack>
                </Stack>

                <Paper sx={{ width: '96%', m: 1, p: 1 }}>
                    <Stack spacing={3} sx={{ height: 1, p: 1 }}>
                        <Typography variant='h5'>{article.Title || ''}</Typography>

                        <Grid container spacing={2} alignItems="center">
                            {/* 圖片 */}
                            {/* 圖片 */}
                            <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={toggleImageZoom}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            objectFit: 'contain',
                                            maxHeight: { xs: '20vh', md: '20vh', lg: '30vh' },  // 將 maxHeight 從 '25vh' 改為 '20vh' 或其他你想要的值
                                            maxWidth: '100%',
                                            width: 'auto',
                                            height: 'auto',
                                            transform: isImageZoomed ? 'scale(1.5)' : 'scale(1)',
                                            transition: 'transform 0.3s ease-in-out'
                                        }}
                                        image={article.ItemIMG ? `data:image/jpeg;base64,${article.ItemIMG}` : ''}
                                    />
                                </Box>
                            </Grid>

                        </Grid>

                        {/* 優惠時間和購買按鈕 */}
                        <Stack direction='row' p={1} spacing={3} sx={{ justifyContent: 'center', bgcolor: '#eeeeee', mt: 3 }}> {/* 加入 mt: 3 來增加上方間距 */}
                            {/* 優惠時間 */}
                            <Stack direction='row' spacing={2} sx={{ alignItems: 'center', justifyContent: 'start' }}>
                                <Typography sx={{ textAlign: 'start', color: '#d32f2f' }}>優惠時間:</Typography>
                                <Typography variant='subtitle1'>{article1.concessionStart ? article1.concessionStart : '無開始日期'}</Typography>
                                <Typography variant='subtitle1'>~</Typography>
                                <Typography variant='subtitle1'>{article1.concessionEnd ? article1.concessionEnd : '無結束日期'}</Typography>
                            </Stack>

                            {/* 購買按鈕 */}
                            <Button
                                sx={{
                                    bgcolor: '#F5D46F',
                                    ':hover': { bgcolor: '#f9a825' },
                                    width: 250,
                                    borderRadius: '25px'
                                }}
                            >
                                <Link href={article.ItemLink} color="inherit" target="_blank" sx={{ textAlign: 'center' }}>
                                    點我購買
                                </Link>
                            </Button>
                        </Stack>
                        {/* 內容 */}
                        <Box sx={{ width: '98%', bgcolor: '#f5f5f5', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Typography
                                variant='subtitle1'
                                sx={{
                                    fontSize: { xs: '14px', md: '16px', lg: '18px' },
                                    wordWrap: 'break-word', // 換行
                                    overflowWrap: 'break-word' // 換行
                                }}
                                dangerouslySetInnerHTML={{ __html: article.Article ? article.Article.replace(/\n/g, '<br />') : '' }}
                            />
                        </Box>
                        {/* 會員標籤 */}
                        <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
                            <Avatar src='./ken1.jpg' sx={{ height: 46, width: 46, border: 1 }} />
                            <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
                                <Typography color='error' variant='subtitle1'>作者:{article.name ? article.name : ''}</Typography>
                                <IconButton
                                    onClick={() => {
                                        console.log("IconButton clicked");
                                        UIDSubscription();
                                    }}
                                    sx={{
                                        ':hover': { color: '#ef9a9a' },
                                        color: isSubscribedIcon ? '#ef9a9a' : '#616161'
                                    }}
                                >
                                    {isSubscribedIcon ? <NotificationsIcon /> : <NotificationsOffIcon />}
                                </IconButton>
                                <Typography variant='subtitle2' sx={{ p: 1 }}>{article.created_at ? article.created_at : ''}</Typography>
                            </Stack>
                        </Stack>

                        <Divider />

                        <Stack sx={{ height: 120, width: 1, boxShadow: 2, borderRadius: 1, overflow: 'hidden' }}>
                            <CardMedia
                                component="img"
                                sx={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                image="./w580.jpg"
                            />
                        </Stack>

                        <Stack sx={{ height: 'auto' }}>
                            <Divider />
                            <Typography mt={2}>評論區</Typography>
                            {(msgdata && msgdata.length > 0) ? (
                                msgdata.map((prop, index) => (
                                    <div key={index} ref={index === msgdata.length - 1 ? lastMessageRef : null}>
                                        <Stack m={2} spacing={2}>
                                            <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
                                                <Avatar src='./ken1.jpg' sx={{ height: 46, width: 46, border: 1 }} />
                                                <Typography color='error' variant='subtitle2'>{prop.user_name}</Typography>
                                                <Button variant="outlined" color="secondary" onClick={() => handleReport(prop.id)}>
                                                    檢舉
                                                </Button>
                                            </Stack>
                                            <Grid >
                                                <Typography variant='subtitle1'>{prop.MSGPost}</Typography>
                                                <Typography variant='subtitle2' mt={2} sx={{ color: '#9e9e9e' }}>{prop.MSGPostTime}</Typography>
                                            </Grid>
                                            <Divider />
                                        </Stack>
                                    </div>
                                ))
                            ) : (
                                <Typography p={5} sx={{ textAlign: 'center' }}>目前沒有留言</Typography>
                            )}
                        </Stack>

                    </Stack>
                </Paper>

                <Stack direction='row' sx={{ height: 50, position: 'sticky', display: 'flex', alignItems: 'center', justifyContent: 'center', bottom: 0, p: 1, bgcolor: 'white' }}>
                    <TextField inputRef={MSG} sx={{ mx: 1, width: 0.5, borderRadius: '3' }} variant="outlined" size='small' type='text' label="留言....." />
                    <Button onClick={MSGtosql} sx={{ mr: 5, bgcolor: '#e0e0e0' }}>傳送</Button>
                    <Stack direction='row' spacing={2}>
                        <IconButton onClick={() => toggleLove(pagedata)} >
                            <FavoriteIcon sx={{ ':hover': { color: '#d50000' }, color: loveStates[pagedata] ? '#d50000' : '#616161' }} />
                        </IconButton>
                        <IconButton onClick={() => toggleHate(pagedata)} >
                            <ThumbDownIcon sx={{ ':hover': { color: '#616161' }, color: hateStates[pagedata] ? '#00AEAE' : '#616161' }} />
                        </IconButton>
                        <IconButton
                            onClick={() => toggleCollect(postwid)}
                            sx={{
                                ':hover': { color: '#ffc107' },
                                color: isFavorited ? '#ffc107' : '#616161'
                            }}
                        >
                            <BookmarkOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={handleReport} sx={{ ':hover': { color: '#f44336' } }}>
                            <ReportOutlinedIcon />
                        </IconButton>
                        <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
                            <DialogTitle>檢舉文章</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="檢舉內容"
                                    type="text"
                                    fullWidth
                                    value={reportContent}
                                    onChange={(e) => setReportContent(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenReportDialog(false)} color="primary">
                                    取消
                                </Button>
                                <Button onClick={handleReportSubmit} color="primary">
                                    確認
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Stack>
            </Box >
        </>
    )
}
