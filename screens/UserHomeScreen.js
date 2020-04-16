import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {DUMMY} from '../data/Dummy-Data';
import { TouchableOpacity } from 'react-native-gesture-handler';

const UserHomeScreen = props => {

    const renderItems = (itemData) => {
        return (
            <TouchableOpacity
                style={styles.tItems}
                onPress={()=> {
                    props.navigation.navigate({
                        routeName:'Punch', 
                        params:{
                            restaurant_id: itemData.item.id,
                        }
                    })
                }}>
                <View 
                    style={{...styles.item, ...{backgroundColor:itemData.item.color}}}>
                    <Text
                        style={styles.itemText}>{itemData.item.title}</Text>
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
    item:{
        flex:1,
        margin:15,
        height:150,
        justifyContent:'center',
        borderRadius:10,
        elevation:10,
        overflow:'hidden',
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