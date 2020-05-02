import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';

const RewardBalance = props => {
    const size = props.size;
    //console.log(size);
    return(
        <View style={{...styles.card, ...props.style}}>
            <View >
                <Text style={{...styles.text, ...{fontSize:size}}}>Loyalty</Text>
                <Text style={{...styles.text, ...{fontSize:size}}}>Points</Text>
            </View>
            <View>
                <Text style={{...styles.points, ...{fontSize:size*3}}}>{props.balance}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card:{
        height: '35%', 
        width:'35%',
        borderRadius:5,
        marginVertical:30,
        marginHorizontal:0,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
        // borderWidth:1,
        // borderColor:'black'
    },
    text:{
        color:Colors.fontDark,
        textAlign:'center',
        fontSize:12,
    },
    points:{
        
        marginStart:5,
        fontSize:36
    }
});

export default RewardBalance;