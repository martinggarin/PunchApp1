import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';

const ListItem = props => {
    return(
        <TouchableOpacity
            style={{...styles.tItems, ...props.style}}
            onPress={props.onClick}
        ><View style={{flex:1, justifyContent:'center'}}>
            <View 
                style={{...styles.outsideContainer, ...{backgroundColor:props.color}, ...props.style}}>
                <View style={{...styles.insideContainer, ...props.insideContainerStyle}}>
                    <View style={styles.textContainer}>
                        <Text style={styles.itemText}>{props.title}</Text>
                    </View>
                    {props.children}
                </View>
            </View>
            <View style={styles.border}></View>
            </View>
            
    </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    outsideContainer:{
        flex:1,
        marginHorizontal:10,
        //marginVertical:10,
        marginTop:5, 
        height:150,
        justifyContent:'space-between',
        alignItems:'center',
        borderRadius:5,
        //elevation:2,
        overflow:'hidden',
        flexDirection:'row',
    
        //borderColor:Colors.backgrounddark
    },
    insideContainer:{
        margin:15,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'91%',
        //padding:10,
        borderRadius:5,
    },
    border:{
        flex:1,
        //borderBottomStartRadius: 50,
        marginStart:30,
        borderColor:Colors.backgrounddark,
        borderBottomWidth:2,
        width:'70%',
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
        width:'70%',
        // borderColor:'black',
        // borderWidth:1,
    }
});

export default ListItem;