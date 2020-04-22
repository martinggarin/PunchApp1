import React, {useCallback, useEffect}from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import MerchantItem from '../../components/MerchantItem';
import {useSelector} from 'react-redux';
import Colors from '../../constants/Colors';

const SearchMerchantScreen = props => {
    const display = useSelector(state => state.merchants.availableRestaurants);
    const faves = useSelector(state => state.merchants.userRestaurants);

    const renderItems = itemData => {
        const isFav = faves.some(r => r.id === itemData.item.id);
        return(
            <MerchantItem 
                style={props.style}
                onClick={()=> 
                    props.navigation.navigate({
                        routeName:'Punch', 
                        params:{
                            restaurant_id: itemData.item.id,
                            isFav: isFav
                        }
                    })
                }
                id={itemData.item.id}
                navigation={props.navigation}
                title={itemData.item.title}
                color={Colors.containers}
                //prog={prog}    
            />
        );
    };

    return(
        <View style={styles.screen}>
            <FlatList 
                data={display}
                renderItem={renderItems}
                keyExtractor={(item, index) => item.id}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.background
    }
});

export default SearchMerchantScreen;