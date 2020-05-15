import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import ListItem from './ListItem';
import Colors from '../constants/Colors';
import {useSelector} from 'react-redux';
import RewardBalance from '../components/RewardBalance';

const MerchantList = props => {
    const faves = useSelector(state => state.user.userMerchants);
    const rs = useSelector(state => state.user.userRewards);
    // console.log(faves)
    // console.log(rs);
    const renderItems = (itemData) => {
        //const prog = itemData.item.punches/itemData.item.getDeal().ammount;
        const isFav = faves.some(r => r === itemData.item.id);
        const hasRS = rs.some(r => r.r_id === itemData.item.id);
        let loyaltyPoints = 0;
        if(hasRS){
            // console.log('________hasRS________');
            loyaltyPoints = rs.find(r=>r.r_id === itemData.item.id).ammount;
            // console.log(loyaltyPoints);
        }
        return (
            <ListItem 
                style={props.style}
                onClick={()=> 
                    props.navigation.navigate({
                        routeName:props.routeName, 
                        params:{
                            merchant_id: itemData.item.id,
                            isFav:isFav,
                            title: itemData.item.title
                        }
                    })
                }
                title={itemData.item.title}
                price={itemData.item.price}
                type={itemData.item.type}
                address={itemData.item.address}
                city={itemData.item.city}
                color={props.color}
                //prog={prog}    
            >
                <RewardBalance 
                    balance={loyaltyPoints}
                    size={12}
                    
                />
            </ListItem>
        );
    };

    return (
        <FlatList 
            {...props}
            data={props.listData}
            keyExtractor={(item, index) => item.id}
            renderItem={renderItems}
            ListFooterComponent={props.footer}
            //ListFooterComponentStyle={props.footerStyle}
        />
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.background,
    }
});

export default MerchantList;