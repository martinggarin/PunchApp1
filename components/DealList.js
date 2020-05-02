import React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import ListItem from './ListItem';
import RewardBalance from './RewardBalance';


const DealList = props => {
    
    const renderDeal = itemData =>{
        console.log('render');
        return(
            <View style={styles.itemContainer}>
                <ListItem 
                    style={styles.listItem}
                    title={itemData.item.reward}
                    onClick={()=>{console.log('to rewards')}}
                    color={Colors.background}
                >
                    <View style={styles.textContainer}>
                        <RewardBalance 
                            balance={itemData.item.ammount}
                            size={12}
                        
                    />
                    </View>
                </ListItem>
            </View>
        );
    };
    return (
        <FlatList 
            data={props.dealData}
            renderItem={renderDeal}
            keyExtractor={(item, index) => item.reward}
            ListFooterComponent={props.footer}
        />
    );
};
const styles = StyleSheet.create({
    listItem:{
        //flex:1,
        height:150
    },
    // textContainer:{
    //     // borderWidth:1
    // },
    itemContainer:{
        flex:1,
        height:150
    },
    text:{
        color:Colors.lines,
        marginHorizontal:10,
        textAlign:'center'

    }
});

export default DealList;