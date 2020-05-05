import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';

const RewardBalance = props => {
    const size = props.size;
    //console.log(size);
    return(
        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
            <View>
                <Text style={{fontSize:size}}>Loyalty</Text>
                <Text style={{fontSize:size}}>Points</Text>
            </View>
            <View style={{marginLeft:5}}>
                <Text style={{fontSize:size*3}}>{props.balance}</Text>
            </View>
        </View>
    );
};

export default RewardBalance;