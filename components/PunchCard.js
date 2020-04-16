import React from 'react';
import { View, StyleSheet } from 'react-native';

const PunchCard = props => {
    return(
        <View style={{...styles.card, ...props.style}}>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    card:{
        flex:1,
        height: '50%', 
        width:300,
        shadowColor:'black',
		shadowOffset:{width:0, height:2},
		shadowRadius:6,
		shadowOpacity:0.26,
		backgroundColor:'white',
		elevation: 7,
		padding:20,
        borderRadius:10,
        marginVertical:50,
        alignItems:'center',
        justifyContent:'center',
    }
});

export default PunchCard;