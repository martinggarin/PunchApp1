import React from 'react';
import {
  StyleSheet, FlatList, View,
} from 'react-native';
import Colors from '../constants/Colors';
import DealItem from './DealItem';
import RewardBalance from './RewardBalance';

const DealList = (props) => {
  let dealData;
  if (!(props.dealData === undefined)) {
    dealData = props.dealData;
  } else {
    dealData = [];
  }

  const renderDeal = (itemData) => (
    <View style={styles.container}>
      <DealItem
        title={itemData.item.reward}
        onClick={() => {
          if (props.merchantSide) {
            console.log('-Merchant Side!');
            props.onTap(itemData.item.code);
          } else {
            console.log('-User Side!');
            props.onTap();
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

  return (
    <FlatList
      data={dealData}
      renderItem={renderDeal}
      keyExtractor={(item, index) => item.reward}
      ListFooterComponent={props.footer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    marginLeft: 10,
    marginRight: 10,
    alignContent: 'center',
  },
});

export default DealList;
