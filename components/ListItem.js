import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';

const ListItem = props => {
    return(
        <TouchableOpacity
            style={{...styles.tItems, ...props.style}}
            onPress={props.onClick}
        >
            <View 
                style={{...styles.outsideContainer, ...{backgroundColor:props.color}, ...props.style}}>
                <View style={styles.insideContainer}>
                    <Text
                        style={styles.itemText}>{props.title}</Text>
                    
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
        elevation:10,
        overflow:'hidden',
        flexDirection:'row',
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
        fontSize:20
    },
});

export default ListItem;