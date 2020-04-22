import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';

const RewardBalance = props => {
    return(
        <View style={{...styles.card, ...props.style}}>
            <Text style={styles.text}>Rewards:</Text>
            <Text style={styles.text}>{props.balance}</Text>
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
        // borderWidth:1,
        // borderColor:'black'
    },
    text:{
        color:Colors.darkLines,
        textAlign:'center',
        fontSize:20,
    }
});

export default RewardBalance;