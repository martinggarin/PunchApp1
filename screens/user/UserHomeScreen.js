import React, { useEffect, useCallback, useState } from 'react';
import {
  StyleSheet, TouchableOpacity, View, SafeAreaView, Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Colors from '../../constants/Colors';
import HeaderButton from '../../components/HeaderButton';
import MerchantList from '../../components/MerchantList';
import * as MerchantActions from '../../store/actions/merchants';
import * as UserActions from '../../store/actions/user';

const UserHomeScreen = (props) => {
  console.log('User Home');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const allMerchants = useSelector((state) => state.merchants.availableMerchants);
  const display = useSelector((state) => state.user.userMerchants);
  const userID = useSelector((state) => state.user.user).id;
  const dispatch = useDispatch();

  const updatedUserMerchants = [];
  if (display && allMerchants.length > 0) {
    Object.values(display).forEach((value) => {
      const merchant = allMerchants.find((m) => m.id === value);
      // console.log('....merch....');
      // console.log(merch);
      if (merchant !== undefined) {
        updatedUserMerchants.push(merchant);
      }
    });
  }

  const loadMerchants = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(MerchantActions.loadAllMerchants());
    await dispatch(UserActions.refreshUser(userID));
    setIsRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadMerchants,
    );
    // console.log('will focus');
    // console.log(allMerchants);
    return () => {
      willFocusSub.remove();
    };
  }, [loadMerchants]);

  useEffect(() => {
    loadMerchants();
  }, [dispatch, loadMerchants]);

  const footer = (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Explore');
      }}
      style={styles.addContainer}
    >
      <View style={styles.addContainer}>
        <Ionicons name="md-add-circle" size={30} color={Colors.primary} />
        <Text style={{ color: Colors.darkLines }}>Add Favorites</Text>
      </View>
    </TouchableOpacity>
  );

  if (updatedUserMerchants.length > 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <MerchantList
          loadMerchants={loadMerchants}
          refreshing={isRefreshing}
          listData={updatedUserMerchants}
          navigation={props.navigation}
          routeName="Punch"
          style={styles.merchantList}
          color={Colors.background}
          footer={footer}
        />
      </SafeAreaView>
    );
  }
  return (footer);
};

UserHomeScreen.navigationOptions = (navData) => ({
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName="md-menu"
        onPress={() => {
          navData.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  ),
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.background,
  },
  addContainer: {
    alignItems: 'center',
    height: 150,
    margin: 10,
  },
  merchantList: {
    flex: 1,
  },
});

export default UserHomeScreen;
