import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import ListItem from './ListItem';
import Colors from '../constants/Colors';
import {useSelector} from 'react-redux';
import RewardBalance from '../components/RewardBalance';

const MerchantList  = props => {
    const faves = useSelector(state => state.merchants.userRestaurants);
    const renderItems = (itemData) => {
        //const prog = itemData.item.punches/itemData.item.getDeal().ammount;
        const isFav = faves.some(r => r.id === itemData.item.id);
        return (
            <ListItem 
                style={props.style}
                onClick={()=> 
                    props.navigation.navigate({
                        routeName:props.routeName, 
                        params:{
                            restaurant_id: itemData.item.id,
                            isFav:isFav,
                            title: itemData.item.title
                        }
                    })
                }
                title={itemData.item.title}
                color={props.color}
                //prog={prog}    
            >
                <RewardBalance 
                    balance={itemData.item.punches}
                    
                />
            </ListItem>
        );
    };

    return (
        <View style={styles.screen}>
            <FlatList 
                data={props.listData}
                keyExtractor={(item, index) => item.id}
                renderItem={renderItems}
                ListFooterComponent={props.footer}
                //ListFooterComponentStyle={props.footerStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.background,
    }
});

export default MerchantList;