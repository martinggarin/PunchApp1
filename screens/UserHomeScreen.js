import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {DUMMY} from '../data/Dummy-Data';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';


const UserHomeScreen = props => {
    //const [prog, setProg] = useState();

    const renderItems = (itemData) => {
        const prog = itemData.item.punches/itemData.item.getDeal().ammount;
        //console.log(itemData.item.punches/itemData.item.getDeal().ammount);
//<Progress.Bar progress={prog} width={100} /> had to remove

        return (
            <TouchableOpacity
                style={styles.tItems}
                onPress={()=> {
                    console.log('what the fuck');
                    props.navigation.navigate({
                        routeName:'Punch', 
                        params:{
                            restaurant_id: itemData.item.id,
                        }
                    })
                }}>
                <View 
                    style={{...styles.outsideContainer, ...{backgroundColor:itemData.item.color}}}>
                    <View style={styles.insideContainer}>
                        <Text
                            style={styles.itemText}>{itemData.item.title}</Text>
                        
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return(
        <View style={styles.screen}>
        <FlatList 
            data={DUMMY}
            renderItem={renderItems}
            keyExtractor={(item, index) => item.id}
        />
        </View>
    );
};
const styles = StyleSheet.create({
    outsideContainer:{
        flex:1,
        margin:15,
        height:150,
        justifyContent:'space-between',
        alignItems:'center',
        borderRadius:10,
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
    screen:{
        flex:1,
        backgroundColor:'#222831',
    }
});

export default UserHomeScreen;