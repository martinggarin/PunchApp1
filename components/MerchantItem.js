import React, {useEffect, useCallback} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Button} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import {toggleFav} from '../store/actions/merchants';
import Colors from '../constants/Colors';

const MerchantItem = props => {
    const r_id = props.id;
    const isFav = useSelector(state => 
        state.merchants.userRestaurants.some(r => r.id === r_id)
    );

    const dispatch = useDispatch();
    
    const toggleFavHandler = useCallback(() => {
        dispatch(toggleFav(r_id));
    }, [dispatch, r_id]);

    useEffect(()=>{
        props.navigation.setParams({isFav:isFav});
    },[isFav]);
    

    return(
        <TouchableOpacity
            style={{...styles.tItems, ...props.style}}
            onPress={props.onClick}
        >
            <View 
                style={{...styles.outsideContainer, ...{backgroundColor:props.color}, ...props.style}}>
                <View style={styles.insideContainer}>
                    <Text
                        style={styles.itemText}>{props.title}
                    </Text>
                    <TouchableOpacity
                        onPress={toggleFavHandler}
                        style={styles.addContainer}
                    >
                        <View style={styles.addContainer}>
                            <Ionicons name={isFav? 'ios-star' : 'md-add'} size={35}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
    </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    outsideContainer:{
        flex:1,
        margin:10,
        height:150,
        justifyContent:'space-between',
        alignItems:'center',
        borderRadius:5,
        //elevation:10,
        overflow:'hidden',
        flexDirection:'row',
        borderWidth:.2,
        borderColor:'black'
    },
    insideContainer:{
        marginHorizontal:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'90%',
        padding:10
    },
    tItems:{
        overflow:'hidden'
    },
    itemText:{
        margin:20, 
        fontSize:20,
        color: Colors.darkLines,
    },
});

export default MerchantItem;