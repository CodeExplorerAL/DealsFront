import React, { useContext } from 'react';
import { Grid, List, ListItem, ListItemButton, Typography } from '@mui/material';
import { CategoryContext } from './CategoryContext';

function Listgogo() {
    const { category, setCategory } = useContext(CategoryContext);

    const handleCategoryClick = (categoryName) => {
    // 使用正則表達式去除表情符號
    const textOnly = categoryName.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}\u{1F9B4}\u{1F9B5}\u{1F9B6}-\u{1F9B9}\u{1F9C0}-\u{1F9C2}\u{1F9D0}-\u{1F9E6}\u{1F9E7}-\u{1F9FF}]+/gu, '');

    console.log("Clicked category:", textOnly.trim());  // 輸出擷取的文字
    setCategory(textOnly.trim());
    };

    const themes = [
['🍔美食', '🧋飲料'],
['🧘🏻生活', '✈️旅遊'],
['💄美妝', '🛍️服飾'],
['🎮遊戲', '📱科技'],
['💰銀行', '🧧抽獎'],
['🎁贈送', '🦄綜合'],
['💳信用卡', '']
    ];

const locations = [
['📍台北', '📍新北'],
['📍桃園', '📍台中'],
['📍臺南', '📍高雄'],
['📍嘉義', '📍苗栗'],
['📍新竹', '📍基隆'],
['📍彰化', '📍南投'],
['📍雲林', '📍屏東'],
['📍宜蘭', '📍花蓮'],
['📍臺東', '📍澎湖'],
['📍金門', '📍連江'],
['📍全台門市', '📍僅限網購'],
['📍網路&門市']
];

    return (
        <>
            <nav>
                <Typography variant="h6" component="h2">主題</Typography>
                <List>
                    {themes.map((pair, index) => (
                        <ListItem disablePadding key={index}>
                            <Grid container>
                                {pair.map((theme, idx) => theme && (
                                    <Grid item sm={6} key={idx}>
                                        <ListItemButton onClick={() => handleCategoryClick(theme)}>
                                            {theme}
                                        </ListItemButton>
                                    </Grid>
                                ))}
                            </Grid>
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h6" component="h2">地區</Typography>
                <List>
                    {locations.map((pair, index) => (
                        <ListItem disablePadding key={index}>
                            <Grid container>
                                {pair.map((location, idx) => location && (
                                    <Grid item sm={6} key={idx}>
                                        <ListItemButton onClick={() => handleCategoryClick(location)}>
                                            {location}
                                        </ListItemButton>
                                    </Grid>
                                ))}
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            </nav>
        </>
    );
}

export default Listgogo;
