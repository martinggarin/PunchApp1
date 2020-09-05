import React, { useCallback, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import Colors from '../../constants/Colors';
import MerchantList from '../../components/MerchantList';
import * as MerchantActions from '../../store/actions/merchants';

const ExploreScreen = (props) => {
  console.log('Explore');
  const display = useSelector((state) => state.merchants.availableMerchants);
  const dispatch = useDispatch();

  const loadMerchants = useCallback(async () => {
    await dispatch(MerchantActions.loadAllMerchants());
  }, [dispatch, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadMerchants,
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadMerchants]);

  return (
    <SafeAreaView style={styles.screen}>
      <MerchantList
        loadMerchants={loadMerchants}
        listData={display}
        refreshing={false}
        navigation={props.navigation}
        routeName="Punch"
        style={styles.merchantList}
        color={Colors.background}
        showDeals
      />
    </SafeAreaView>
  );
};

ExploreScreen.navigationOptions = (navData) => ({
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
});

export default ExploreScreen;
