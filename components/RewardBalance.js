import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const RewardBalance = props => {
    const size = props.size;
    return(
        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
            <View>
                <Text style={{fontSize:size}}>{props.text[0]}</Text>
                <Text style={{fontSize:size}}>{props.text[1]}</Text>
            </View>
            <View style={{marginLeft:5}}>
                <Text style={{fontSize:size*3}}>{props.number}</Text>
            </View>
        </View>
    );
};

export default RewardBalance;