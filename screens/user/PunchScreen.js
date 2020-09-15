import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import PunchCard from '../../components/PunchCard';
import Colors from '../../constants/Colors';
import HeaderButton from '../../components/HeaderButton';
import { toggleFav } from '../../store/actions/user';
import DealList from '../../components/DealList';
import RewardBalance from '../../components/RewardBalance';

const PunchScreen = (props) => {
  console.log('Punch');
  const merchantID = props.navigation.getParam('merchantID');
  const merchant = useSelector(
    (state) => (state.merchants.availableMerchants).find((m) => m.id === merchantID),
  );
  const faves = useSelector((state) => state.user.userMerchants);
  const userID = useSelector((state) => state.user.user.id);
  const rs = useSelector((state) => state.user.userRewards);

  let deals;
  let isFav;
  let hasRS;
  if (merchant === undefined) {
    deals = [];
  } else {
    deals = merchant.deal;
  }
  if (faves === undefined) {
    isFav = false;
  } else {
    isFav = faves.some((r) => r === merchantID);
  }
  if (rs === undefined) {
    hasRS = false;
  } else {
    hasRS = rs.some((r) => r.merchantID === merchantID);
  }
  let loyaltyPoints = 0;
  if (hasRS) {
    loyaltyPoints = rs.find((r) => r.merchantID === merchantID).amount;
  }
  const dispatch = useDispatch();

  const toggleFavHandler = useCallback(() => {
    dispatch(toggleFav(merchantID, userID));
  }, [merchantID, dispatch, userID]);

  useEffect(() => {
    props.navigation.setParams({ isFav, toggleFav: toggleFavHandler });
  }, [isFav, toggleFavHandler]);

  return (
    <View style={styles.screen}>
      <PunchCard style={styles.punchCard}>
        <View style={styles.textContainer}>
          <RewardBalance
            text={['Loyalty', 'Points']}
            number={loyaltyPoints}
            size={20}
          />
          <Ionicons name="md-add-circle" size={75} />
        </View>
      </PunchCard>
      <View style={{ height: '67.5%', width: '100%', justifyContent: 'center' }}>
        <DealList
          merchantSide={false}
          dealData={deals}
          onTap={() => props.navigation.navigate('Rewards')}
        />
      </View>
    </View>
  );
};

PunchScreen.navigationOptions = (navigationData) => {
  const merchantTitle = navigationData.navigation.getParam('title');
  const isFav = navigationData.navigation.getParam('isFav');
  const toggleFavHandler = navigationData.navigation.getParam('toggleFav');
  return {
    headerTitle: merchantTitle,
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
    },
    headerStyle: {
      backgroundColor: Colors.header,
    },
    headerTintColor: Colors.lines,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="favorites"
          iconName={isFav ? 'ios-star' : 'ios-star-outline'}
          onPress={toggleFavHandler}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    // justifyContent:'center',
    // height:'50%',
    backgroundColor: Colors.background,
  },
  punchCard: {
    height: '30%',
    width: '95%',
    margin: '2.5%',
    backgroundColor: Colors.primary,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginStart: 10,

  },
});
export default PunchScreen;
