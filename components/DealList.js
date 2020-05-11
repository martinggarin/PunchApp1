import React from 'react';
import { StyleSheet, FlatList, SafeAreaView,Text, View } from 'react-native';
import Colors from '../constants/Colors';
import DealItem from './DealItem';
import RewardBalance from './RewardBalance';


const DealList = props => {
    const renderDeal = itemData => {
        console.log('render');
        return(
            <View style={{height:70, marginLeft:10, marginRight:10, alignContent:'center'}}>
                <DealItem
                    title={itemData.item.reward}
                    onClick={ () => {
                        if (props.merchantSide) {
                            console.log('Merchant Side!');
                            props.onTap(itemData.item.code)
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