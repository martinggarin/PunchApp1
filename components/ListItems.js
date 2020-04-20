import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import ListItem from './ListItem';

const ListItems = props => {
    const renderItems = (itemData) => {
        const prog = itemData.item.punches/itemData.item.getDeal().ammount;

        return (
            <ListItem 
                onClick={()=> 
                    props.navigation.navigate({
                        routeName:props.routeName, 
                        params:{
                            restaurant_id: itemData.item.id
                        }
                    })
                }
                title={itemData.item.title}
                color={itemData.item.color}
                //prog={prog}    
            />
        );
    };

    return (
        <View style={styles.screen}>
            <FlatList 
                data={props.listData}
                renderItem={renderItems}
                keyExtractor={(item, index) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:'#222831',
    }
});

export default ListItems;