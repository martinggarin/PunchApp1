import React from 'react';
import { StyleSheet, FlatList, SafeAreaView,Text, View } from 'react-native';
import Colors from '../constants/Colors';
import DealItem from './DealItem';
import RewardBalance from './RewardBalance';


const DealList = props => {
    
    if (!(props.dealData === undefined)){
        var sortedDealData = props.dealData
        sortedDealData.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    }
    else{
        var sortedDealData = []
    }

    const renderDeal = itemData => {
        return(
            <View style={styles.container}>
                <DealItem
                    title={itemData.item.reward}
                    onClick={ () => {
                        if (props.merchantSide) {
                            console.log('-Merchant Side!');
                            props.onTap(itemData.item.code)
                        }
                        else {
                            console.log('-User Side!');
                            props.onTap()
                        }
                    }}
                    color={Colors.background}
                >
                    <View>
                        <RewardBalance
                            text={['Loyalty', 'Points']}
                            number={itemData.item.amount}
                            size={10}
                        />
                    </View>
                </DealItem>
            </View>
        );
    };
    
    return (
        <FlatList 
            data={sortedDealData}
            renderItem={renderDeal}
            keyExtractor={(item, index) => item.reward}
            ListFooterComponent={props.footer}
        />
    );
};

const styles = StyleSheet.create({
    container:{
        height:70,
        marginLeft:10,
        marginRight:10,
        alignContent:'center'
    }
})

export default DealList;