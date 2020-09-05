import React from 'react';
import {
  StyleSheet, FlatList, Text, View, TouchableOpacity,
} from 'react-native';

const TransactionList = (props) => {
  let sortedTransactions;
  if (!(props.transactions === undefined || props.transactions === null)) {
    sortedTransactions = props.transactions;
    sortedTransactions.sort((a, b) => b.code - a.code);
  } else {
    sortedTransactions = [];
  }

  const renderTransaction = (itemData) => (
    <TouchableOpacity onPress={() => props.onPress(itemData.item.code)}>
      <View style={styles.rowContainer}>
        <View style={styles.dateView}>
          <Text style={styles.boldText}>{itemData.item.date.slice(0, 8)}</Text>
          <Text style={styles.boldText}>{itemData.item.date.slice(9)}</Text>
        </View>
        <View>
          <Text>
            Customer:
            {itemData.item.customerID.slice(0, 7)}
            ...
          </Text>
          <Text>
            Location:
            {itemData.item.location}
          </Text>
          <Text>
            Employee:
            {itemData.item.employee}
          </Text>
          <Text>
            Amount:
            {itemData.item.amount}
          </Text>
          <Text>
            Deal:
            {(itemData.item.reward === undefined) ? 'N/A' : itemData.item.reward}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={{ width: '100%' }}
      data={sortedTransactions}
      renderItem={renderTransaction}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateView: {
    width: '35%',
    alignItems: 'center',
    marginRight: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default TransactionList;
