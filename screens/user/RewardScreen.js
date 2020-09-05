import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import QRCode from 'react-native-qrcode-generator';
import HeaderButton from '../../components/HeaderButton';
import Colors from '../../constants/Colors';

const RewardScreen = () => {
  console.log('Reward');
  const userID = useSelector((state) => state.user.user.id);
  // console.log('------ID--------');
  // console.log(userID);
  return (
    <View style={styles.screen}>
      <Text>
        Scan this QR Code to process rewards!
      </Text>
      <QRCode value={userID} size={250} />
    </View>
  );
};

RewardScreen.navigationOptions = (navData) => ({
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  image: {
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
  },
  text: {
    color: Colors.fontLight,
  },
});

export default RewardScreen;
