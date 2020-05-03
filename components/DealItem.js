import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';

const DealItem = props => {
    return(
        <TouchableOpacity
            style={{...styles.tItems, ...props.style}}
            onPress={props.onClick}
        ><View style={styles.outer}>
            <View 
                style={{...styles.outsideContainer, ...{backgroundColor:props.color}, ...props.style}}>
                <View style={{...styles.insideContainer, ...props.insideContainerStyle}}>
                    <View style={styles.textContainer}>
                        
                        <Text style={styles.titleText}>{props.title}</Text>
                        
                    </View>
                    <View style={styles.containerRight}>
                        {props.children}
                    </View>
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
        height:1000,
        //justifyContent:'space-between',
        alignItems:'center',
        borderRadius:5,
        //elevation:2,
        overflow:'hidden',
        flexDirection:'row',
        //borderColor:Colors.darkLines,
        //borderWidth:1,
    
        //borderColor:Colors.backgrounddark
    },
    outer:{ 
        justifyContent:'center',
        borderColor:Colors.lightLines,
        //borderBottomWidth:1,
        height:'60%',
        marginTop:20,
        width:'100%',
        //alignItems:'center'
    },
    containerRight:{
        //borderWidth:1,
        //flex:1,
        justifyContent:'center',
        width:'50%',
        alignItems:'center',
    },
    distanceContainer:{
        borderWidth:1,
        marginTop:0
    },
    insideContainer:{
        //margin:15,
        flexDirection:'row',
        justifyContent:'space-between',
        //alignItems:'center',
        width:'91%',
        //padding:10,
        //borderRadius:5,
        //alignItems:'center'
    },
    border:{
        //flex:1,
        //borderWidth:1,
        height:1,
        //borderBottomStartRadius: 50,
        // marginStart:'3%',
        borderColor:Colors.lightLines,
        borderBottomWidth:1,
        width:'86%',
        marginHorizontal:20,
    },
    tItems:{
        overflow:'hidden'
    },
    titleText:{
        margin:0, 
        marginStart:0,
        fontSize:21,
        //fontWeight:'bold',
        color:Colors.fontDark,
        textAlign:'left'

    },
    textContainer:{
        width:'70%',
        borderColor:'black',
        //borderWidth:1,
        flexDirection:'column',
        justifyContent:'center',
        marginStart:0
    },
    addressTextContainer:{
    },
    addressText:{
        color:Colors.darkLines,
    },
    priceText:{},
    priceTextContainer:{}

});

export default DealItem;