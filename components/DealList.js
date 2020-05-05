import React from 'react';
import { StyleSheet, FlatList, SafeAreaView,Text, View } from 'react-native';
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
            <View style={{height:70, marginLeft:10, marginRight:10, alignContent:'center'}}>
                <DealItem
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
                    <View>
                        <RewardBalance 
                            balance={itemData.item.ammount}
                            size={10}
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

export default DealList;