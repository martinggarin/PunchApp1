import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import Colors from '../constants/Colors';
import ListItem from './ListItem';
import RewardBalance from './RewardBalance';

const MerchantList = (props) => {
  const faves = useSelector((state) => state.user.userMerchants);
  const rs = useSelector((state) => state.user.userRewards);
  const [state, setState] = useState({ data: props.listData, search: '' });
  // console.log(faves)
  // console.log(rs);

  const searchAction = (text) => {
    const newData = props.listData.filter((item) => {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setState({
      data: newData,
      search: text,
    });
  };

  const renderItems = (itemData) => {
    // console.log(itemData)
    // const prog = itemData.item.punches/itemData.item.getDeal().amount;
    let isFav;
    let hasRS;
    let text;
    let number;
    if (faves === undefined) {
      isFav = false;
    } else {
      isFav = faves.some((m) => m === itemData.item.id);
    }
    if (rs === undefined) {
      hasRS = false;
    } else {
      hasRS = rs.some((m) => m.merchantID === itemData.item.id);
    }
    if (props.showDeals) {
      text = ['Deals', 'Available'];
      if (itemData.item.deal === undefined) {
        number = 0;
      } else {
        number = itemData.item.deal.length;
      }
    } else {
      text = ['Loyalty', 'Points'];
      number = 0;
      if (hasRS) {
        // console.log('________hasRS________');
        number = rs.find((m) => m.merchantID === itemData.item.id).amount;
        // console.log(number);
      }
    }

    return (
      <ListItem
        style={props.style}
        onClick={() => props.navigation.navigate({
          routeName: props.routeName,
          params: {
            merchantID: itemData.item.id,
            isFav,
            title: itemData.item.title,
          },
        })}
        title={itemData.item.title}
        price={itemData.item.price}
        type={itemData.item.type}
        address={itemData.item.address}
        city={itemData.item.city}
        color={props.color}
        // prog={prog}
      >
        <RewardBalance
          text={text}
          number={number}
          size={12}
        />
      </ListItem>
    );
  };

  return (
    <View style={styles.screen}>
      <SearchBar
        containerStyle={{ backgroundColor: Colors.background }}
        inputContainerStyle={{ backgroundColor: Colors.secondaryBackground, borderRadius: 10 }}
        placeholder="Search Merchants"
        lightTheme
        onChangeText={(text) => searchAction(text)}
        autoCorrect={false}
        value={state.search}
      />
      <FlatList
        {...props}
        onRefresh={() => {
          props.loadMerchants();
          setTimeout(() => {
            setState({ data: props.listData, search: '' });
          }, 500);
        }}
        isRefreshing={props.refreshing}
        data={state.data}
        keyExtractor={(item) => item.id}
        renderItem={renderItems}
        ListFooterComponent={props.footer}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default MerchantList;
