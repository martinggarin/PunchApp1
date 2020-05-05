import React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import DealItem from './DealItem';
import RewardBalance from './RewardBalance';


const DealList = props => {
    

    const tap = (ammount) => {
        if(props.merchantSide){
            console.log("ammount: "+ammount);
            
            props.navigation.setParams({
                Ammount: ammount
            });
            props.navigation.navigate({
                routeName:'Scan', 
                params:{
                    RedeemAmmount: ammount
                }
            });
        }
        else {
            console.log('User Side!');
        }
    }
    const renderDeal = itemData =>{
        console.log('render');
        return(
            <View style={styles.itemContainer}>
                <DealItem 
                    style={styles.listItem}
                    title={itemData.item.reward}
                    onClick={() => {
                        if(props.merchantSide){
                            console.log("ammount: "+itemData.item.ammount);
                            
                            // props.navigation.setParams({
                            //     Ammount: itemData.item.ammount
                            // });
                            props.navigation.navigate("ScanNavigator",
                                {
                                // // type: "Navigate",
                                //screen: "Scan",
                                params: {Ammount:itemData.item.ammount}
                                });
                        }
                        else {
                            console.log('User Side!');
                        }

                    }}
                    color={Colors.background}
                >
                    <View style={styles.textContainer}>
                        <RewardBalance 
                            balance={itemData.item.ammount}
                            size={12}
                        
                    />
                    </View>
                </DealItem>
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