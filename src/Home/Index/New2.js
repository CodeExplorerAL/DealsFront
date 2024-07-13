import { React, useState, useContext, useEffect } from 'react';
import Newspage from './Newspage';
import { themeforbutton } from './Appbar';
import { TakePostcontext, TakePostProvider } from './AllApi/IndexAPI';
import { IconButton, Stack, Grid, Typography, ThemeProvider, CardContent, Badge, Button, Modal, CardActions, CardMedia, Card, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import { CategoryContext } from './CategoryContext';


function New2() {
    const {
        category, selectedTab, searchref,
        isUserLoggedIn, setIsUserLoggedIn, checkLoginStatus,
        postbook, setPostBook,
        formatDate,
        loveStates, setLoveStates,
        likeCounts, setLikeCounts,
        hateStates, setHateStates,
        dislikeCounts, setDislikeCounts,
        fetchPostBook,
        toggleLove,
        toggleHate,
    } = useContext(CategoryContext);

    const {
        setpagedata,
        handleWidUpdate,
        collect,
        collectforpost,
        checkcollectdata,
        setcheckcollectdata,
    } = useContext(TakePostcontext);

    const search = searchref;
    const [pageopen, setpageopen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPostCount, setCurrentPostCount] = useState(3);
    const itemsPerPage = 3;
    const currentPosts = postbook.slice(0, currentPostCount);

    const checkcollect = (wid) => {
        // 這部分還沒有被使用
    };

    useEffect(() => {
        fetchPostBook();
        setCurrentPage(1);
        checkcollect();
    }, [isUserLoggedIn, selectedTab, category, search]);

    useEffect(() => {
        postbook.forEach(book => {
            collectforpost(book.WID);
        });
    }, [postbook]);


    useEffect(() => {
        const totalPages = Math.ceil(postbook.length / itemsPerPage);
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [postbook, itemsPerPage, currentPage]);

    const loadMorePosts = () => {
        const newCount = currentPostCount + itemsPerPage;
        setCurrentPostCount(newCount);
    };

    const onpenpage = (prop) => {
        setpageopen(true);
        setpagedata(prop);
    };

    const closepage = () => setpageopen(false);

    const [isBookmarked, setIsBookmarked] = useState(false);


    return (
        <>
            <Modal open={pageopen} onClose={closepage}>
                <Newspage closepage={closepage} />
            </Modal>

            {currentPosts.map((bookdata, index) => (
                <div key={index}>
                    <Grid item key={bookdata.WID}>
                        <Card sx={{ width: 250, height: 480, m: 3 }} key={bookdata.WID}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                {/* 優惠狀態 */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    backgroundColor: '#f44336', // 紅色
                                    color: '#ffffff',
                                    padding: '5px 10px',
                                    fontSize: '14px',
                                    zIndex: 2, // 確保它在其他元素之上
                                    opacity: 0.8 // 可以設定適當的透明度
                                }}>
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        backgroundColor: bookdata.InProgress === '優惠中' ? '#4CAF50' : bookdata.InProgress === '已結束' ? '#f44336' : bookdata.InProgress === '準備中' ? '#2196F3' : '#f44336', // 綠色表示優惠中，紅色表示已結束，藍色表示準備中，預設為紅色
                                        color: '#ffffff',
                                        padding: '5px 10px',
                                        fontSize: '14px',
                                        zIndex: 2, // 確保它在其他元素之上
                                        opacity: 0.8 // 可以設定適當的透明度
                                    }}>
                                        {bookdata.InProgress ? bookdata.InProgress : '永久'}
                                    </Box>

                                </Box>

                                {/* 書籍按鈕 */}
                                <Button sx={{ height: 1 }} onClick={() => onpenpage(bookdata.WID)}>
                                    <CardMedia
                                        component="img"
                                        sx={{ objectFit: 'contain', width: 200, height: 200 }}
                                        image={bookdata.ItemIMG ? `data:image/jpeg;base64,${bookdata.ItemIMG}` : '../dd.jpg'}
                                    />
                                </Button>
                            </Box>

                            <CardContent sx={{ height: 150 }}>
                                <Stack direction='row' spacing={2}>
                                    <Typography variant="subtitle1" sx={{ color: 'red' }}>{bookdata.product_tag}</Typography>
                                    <Typography variant="subtitle1" sx={{ color: 'red' }}>{bookdata.location_tag}</Typography>
                                </Stack>
                                <Typography variant="h6">
                                    {bookdata.Title.length > 12 ? `${bookdata.Title.slice(0, 12)}...` : bookdata.Title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bookdata.Article.length > 15 ? `${bookdata.Article.slice(0, 15)}...` : bookdata.Article}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{}}>
                                <Stack direction='row' spacing={1}>
                                    <IconButton disabled>
                                        <Badge badgeContent={''} color="error" sx={{ position: 'absolute', right: -1, top: 6 }}>
                                        </Badge>
                                        <Typography sx={{ color: '#f44336' }}>折扣狀態</Typography>
                                    </IconButton>
                                    <IconButton onClick={() => toggleLove(bookdata.WID)}>
                                        <Badge badgeContent={likeCounts[bookdata.WID]} color="error" showZero={true}>
                                            <FavoriteIcon sx={{ ':hover': { color: '#d50000' }, color: loveStates[bookdata.WID] ? '#d50000' : '#616161' }} />
                                        </Badge>
                                    </IconButton>
                                    <IconButton onClick={() => toggleHate(bookdata.WID)}>
                                        <Badge badgeContent={dislikeCounts[bookdata.WID]} color="error" showZero={true}>
                                            <ThumbDownIcon sx={{ ':hover': { color: '#00AEAE' }, color: hateStates[bookdata.WID] ? '#00AEAE' : '#616161' }} />
                                        </Badge>
                                    </IconButton>
                                    <IconButton
                                        onClick={async () => {
                                            const message = await handleWidUpdate(bookdata.WID);
                                            setIsBookmarked(!isBookmarked); // 切換收藏狀態
                                            window.alert(message); // 使用後端返回的提示訊息
                                        }}
                                        sx={{
                                            ':hover': { color: '#ffc107' },
                                            color: collect[bookdata.WID] && collect[bookdata.WID].isFavorited ? '#ffc107' : '#616161'
                                        }}
                                    >
                                        <BookmarkOutlinedIcon />
                                    </IconButton>

                                </Stack>
                            </CardActions>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                發文日期 : {formatDate(bookdata.PostTime)}
                            </Typography>
                        </Card>
                    </Grid>
                </div>
            ))}

            <ThemeProvider theme={themeforbutton}>
                {currentPosts.length < postbook.length &&
                    <Grid container my={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={loadMorePosts} sx={{ width: 100 }}>
                            加載更多
                        </Button>
                    </Grid>
                }
            </ThemeProvider>
        </>
    );
}

export default New2;
