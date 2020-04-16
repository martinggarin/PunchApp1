import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {DUMMY} from '../data/Dummy-Data';
import Colors from '../constants/Colors';

const RewardScreen = props => {
    const r_id = props.navigation.getParam('restaurant_id');
    const r_item = DUMMY.find(r => r.id === r_id);
    const coupon = r_item.getDeal().getReward();
    const code = r_item.getDeal().code;

    return(
        <View style={styles.screen}>
            <Text style={styles.text}>This cupon entitles you to a {coupon}</Text>
            <Image 
                source={{uri: code}}
                style={styles.image}/>
            
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.background,
    },
    image:{
        width:'80%',
        height:'50%',
        resizeMode:'contain'
    },
    text:{
        color:'white'
    }
});

export default RewardScreen;