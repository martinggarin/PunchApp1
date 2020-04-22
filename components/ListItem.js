import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';

const ListItem = props => {
    return(
        <TouchableOpacity
            style={{...styles.tItems, ...props.style}}
            onPress={props.onClick}
        >
            <View 
                style={{...styles.outsideContainer, ...{backgroundColor:props.color}, ...props.style}}>
                <View style={{...styles.insideContainer, ...props.insideContainerStyle}}>
                    <View style={styles.textContainer}>
                        <Text style={styles.itemText}>{props.title}</Text>
                    </View>
                    {props.children}
                </View>
            </View>
    </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    outsideContainer:{
        flex:1,
        marginHorizontal:10,
        //marginVertical:10,
        marginTop:20, 
        height:150,
        justifyContent:'space-between',
        alignItems:'center',
        borderRadius:5,
        //elevation:2,
        overflow:'hidden',
        flexDirection:'row',
        borderWidth:2,
        borderColor:Colors.backgrounddark
    },
    insideContainer:{
        margin:15,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'91%',
        //padding:10,
        borderRadius:5,
        borderWidth:2,
        borderColor:Colors.backgrounddark
    },
    tItems:{
        overflow:'hidden'
    },
    itemText:{
        margin:15, 
        fontSize:20,
        color:Colors.backgrounddark,
    },
    textContainer:{
        width:'75%',
        // borderColor:'black',
        // borderWidth:1,
    }
});

export default ListItem;