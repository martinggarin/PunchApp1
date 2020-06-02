import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const PunchCard = props => {
    return(
        <View style={{...styles.card, ...props.style}}>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    card:{
        //flex:1,
        shadowColor:Colors.shadow,
		shadowOffset:{width:0, height:2},
		shadowRadius:6,
		shadowOpacity:0.26,
		//backgroundColor:'white',
		elevation: 7,
		//padding:20,
        borderRadius:3,
        alignItems:'center',
        justifyContent:'center',
    }
});

export default PunchCard;