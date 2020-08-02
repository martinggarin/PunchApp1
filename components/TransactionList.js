import React from 'react';
import { StyleSheet, FlatList,Text, View } from 'react-native';
import moment from 'moment'

const TransactionList = props => {
    if (!(props.transactions === undefined)){
        var sortedTransactions = props.transactions
        sortedTransactions.sort((a, b) => moment(b.date, 'MM/DD hh:mm:ss a').diff(moment(a.date, 'MM/DD hh:mm:ss a'), 'seconds'));
    }
    else{
        var sortedTransactions = []
    }

    const renderTransaction = itemData => {
        if(itemData.item.reward === undefined){
            itemData.item.reward = ''
        }
        return(
            <View style={styles.rowContainer}>
                <Text style={{...styles.text, width:'35%', textAlign:'center'}}>{itemData.item.date}</Text>
                <Text style={{...styles.text, width:'25%'}}>{itemData.item.customerID.slice(0, 7)}...</Text>
                <Text style={{...styles.text, width:'20%'}}>{itemData.item.reward}</Text>
                <Text style={{...styles.text, width:'20%', textAlign:'center'}}>{itemData.item.amount}</Text>
            </View>
        );
    };
    
    return (
        <FlatList 
            data={sortedTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

const styles = StyleSheet.create({
    rowContainer:{
        flex: 1,
        height: 40,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1
    },
    text:{
        //marginLeft:5,
    },
})

export default TransactionList;