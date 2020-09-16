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
  console.log('Rewards');
  const userID = useSelector((state) => state.user.user.id);
  // console.log('------ID--------');
  // console.log(userID);
  return (
    <View style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image style={{ flex: 1, width: undefined, height: undefined }} source={require('../../assets/logo.png')} resizeMode="contain" />
      </View>
      <View style={{
        borderWidth: 5, padding: 7, borderRadius: 15, borderColor: Colors.darkLines,
      }}
      >
        <View style={{
          borderWidth: 5, padding: 10, borderRadius: 10, borderColor: Colors.primary,
        }}
        >
          <QRCode value={userID} size={250} />
        </View>
      </View>
      <Text style={styles.text}>
        Merchants will scan this QR Code to process rewards!
      </Text>
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
  imageContainer: {
    width: '80%',
    height: '11%',
    marginTop: 30,
    marginBottom: 30,
  },
  image: {
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
  },
  text: {
    color: Colors.darkLines,
    width: '80%',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
  },
});

export default RewardScreen;
