import React from 'react';
import {
  View, Text, StyleSheet, Image,
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
      <View style={{
        width: '90%', height: '20%',
      }}
      >
        <Image style={{ flex: 1, width: undefined, height: undefined }} source={require('../../assets/logo.png')} resizeMode="contain" />
      </View>
      <Text style={styles.text}>
        Merchants will scan this QR Code to process rewards!
      </Text>
      <View style={{
        borderWidth: 5, padding: 10, borderRadius: 15, borderColor: Colors.darkLines,
      }}
      >
        <View style={{
          borderWidth: 5, padding: 15, borderRadius: 10, borderColor: Colors.primary,
        }}
        >
          <QRCode value={userID} size={250} />
        </View>
      </View>
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
    backgroundColor: Colors.background,
  },
  image: {
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
  },
  text: {
    color: Colors.darkLines,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 30,
  },
});

export default RewardScreen;
