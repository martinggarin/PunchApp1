import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, View, Text, StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Dialog from 'react-native-dialog';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import HeaderButton from '../../components/HeaderButton';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';

const MerchantHomeScreen = (props) => {
  console.log('Merchant Home');
  const merchant = useSelector((state) => state.merchants.myMerchant);
  // console.log(merchant)
  let deals = useSelector((state) => state.merchants.myDeals);
  const [editPromptVisibility, setEditPromptVisibility] = useState(false);
  const [employeePromptVisibility, setEmployeePromptVisibility] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  let newMerchant;
  if (merchant.adminPassword) {
    newMerchant = false;
  } else {
    newMerchant = true;
  }

  let totalDeals = null;
  let totalCustomers = null;
  if (deals === undefined || deals === null) {
    totalDeals = 0;
    deals = [];
  } else {
    totalDeals = deals.length;
  }
  if (merchant.customers === undefined || merchant.customers === null) {
    totalCustomers = 0;
    merchant.customers = [];
  } else {
    totalCustomers = merchant.customers.length;
  }

  const dealTapHandler = useCallback((dealCode) => {
    Alert.alert(
      deals[dealCode].reward,
      `${deals[dealCode].amount} point(s) will be deducted from the customer's loyalty point balance`,
      [
        {
          text: 'Cancel',
          onPress: () => { console.log('-Cancel Pressed'); },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            console.log('-Scan Handler');
            props.navigation.navigate('Scan', { reward: deals[dealCode].reward, amount: deals[dealCode].amount });
          },
        },
      ],
      { cancelable: true },
    );
  });

  useEffect(() => {
    props.navigation.setParams({
      deals: totalDeals,
      adminPasswordExists: (!newMerchant),
      navigateToEdit: () => props.navigation.navigate('Edit'),
      navigateToEmployee: () => props.navigation.navigate('Employee'),
      setEditPromptVisibility,
      setEmployeePromptVisibility,
    });
  }, [totalDeals]);

  return (
    <View style={styles.screen}>
      <View style={styles.upperContainer}>
        <View style={styles.rowContainer}>
          <View style={{ left: 10, width: '70%' }}>
            <Text style={styles.largeBoldText}>
              {merchant.title}
            </Text>
            <Text>
              {merchant.price}
              {' '}
              •
              {' '}
              {merchant.type}
            </Text>
            <Text style={styles.addressText}>
              {merchant.address}
              {' '}
              •
              {' '}
              {merchant.city}
            </Text>
          </View>
          <View style={{ right: 15 }}>
            <View>
              <Text style={styles.smallBoldText}>Total Deals</Text>
              <Text style={{ textAlign: 'center' }}>{totalDeals}</Text>
            </View>
            <View>
              <Text style={styles.smallBoldText}>Customers</Text>
              <Text style={{ textAlign: 'center' }}>{totalCustomers}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.lowerContainer}>
        <DealList
          dealData={deals}
          onTap={dealTapHandler}
          merchantSide
        />
      </View>
      <Dialog.Container visible={editPromptVisibility}>
        <Dialog.Title style={{ fontWeight: 'bold' }}>Verification Required!</Dialog.Title>
        <Dialog.Description>
          Please enter your administrator password to access the edit screen...
        </Dialog.Description>
        <Dialog.Input
          style={{ borderBottomWidth: Platform.OS === 'android' ? 1 : 0, color: Colors.borderDark }}
          autoCorrect={false}
          autoCompleteType="off"
          onChangeText={(text) => {
            console.log('-Input Change Handler');
            setAdminPasswordInput(text);
          }}
          autoCapitalize="none"
          secureTextEntry
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setAdminPasswordInput('');
            setEditPromptVisibility(false);
          }}
        />
        <Dialog.Button
          label="Confirm"
          onPress={() => {
            if (adminPasswordInput === merchant.adminPassword) {
              props.navigation.navigate('Edit');
              setAdminPasswordInput('');
              setEditPromptVisibility(false);
            } else {
              Alert.alert(
                'Wrong Password!',
                'Please try again...',
                [{ text: 'Okay' }],
              );
            }
          }}
        />
      </Dialog.Container>
      <Dialog.Container visible={employeePromptVisibility}>
        <Dialog.Title style={{ fontWeight: 'bold' }}>Verification Required!</Dialog.Title>
        <Dialog.Description>
          Please enter your administrator password to access the employee screen...
        </Dialog.Description>
        <Dialog.Input
          style={{ borderBottomWidth: Platform.OS === 'android' ? 1 : 0, borderColor: Colors.borderDark }}
          autoCorrect={false}
          autoCompleteType="off"
          onChangeText={(text) => {
            console.log('-Input Change Handler');
            setAdminPasswordInput(text);
          }}
          autoCapitalize="none"
          secureTextEntry
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setAdminPasswordInput('');
            setEmployeePromptVisibility(false);
          }}
        />
        <Dialog.Button
          label="Confirm"
          onPress={() => {
            if (adminPasswordInput === merchant.adminPassword) {
              props.navigation.navigate('Employee');
              setAdminPasswordInput('');
              setEmployeePromptVisibility(false);
            } else {
              Alert.alert(
                'Wrong Password!',
                'Please try again...',
                [{ text: 'Okay' }],
              );
            }
          }}
        />
      </Dialog.Container>
    </View>
  );
};

MerchantHomeScreen.navigationOptions = (navigationData) => {
  const adminPasswordExists = navigationData.navigation.getParam('adminPasswordExists');
  const navigateToEdit = navigationData.navigation.getParam('navigateToEdit');
  const setEditPromptVisibility = navigationData.navigation.getParam('setEditPromptVisibility');
  const setEmployeePromptVisibility = navigationData.navigation.getParam('setEmployeePromptVisibility');
  return {
    headerLeft: () => (
      <View style={styles.headerLeft}>
        <View style={styles.headerButton}>
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Menu"
              iconName="md-menu"
              onPress={() => {
                navigationData.navigation.toggleDrawer();
              }}
            />
          </HeaderButtons>
        </View>
        <View style={styles.headerButton}>
          <AntDesign
            name="questioncircleo"
            size={25}
            color={Colors.lightLines}
            onPress={() => {
              Alert.alert(
                'Merchant Help',
                'Thank you for using PunchApp! We hope you are enjoying your experience.\n\n'
                                    + '• Maintain at least one deal to ensure your profile remains public\n\n'
                                    + '• To credit loyalty points to a customer\'s balance, scan their reward code using the scanning tab\n\n'
                                    + '• To redeem a deal for a customer, select it on the home screen and scan their reward code\n\n'
                                    + '• Profile information and deals can only be updated from the edit screen using an administrator password\n\n'
                                    + '• Employee information can only be updated from the employee screen using an administrator password\n\n'
                                    + '• The audit tab can be used check employee validated transactions once authenticated using a manager ID\n\n'
                                    + '• A completed transaction can be reversed by selecting it in the transaction history on the audit tab',
                [{ text: 'Okay' }],
              );
            }}
          />
        </View>
      </View>
    ),
    headerRight: () => (
      <View style={styles.headerRight}>
        <View style={styles.headerButton}>
          <Ionicons
            name="ios-people"
            size={25}
            color={Colors.lightLines}
            onPress={() => {
              console.log('-Employee Handler');
              if (adminPasswordExists) {
                setEmployeePromptVisibility(true);
              } else {
                navigateToEdit();
              }
            }}
          />
        </View>
        <View style={styles.headerButton}>
          <Feather
            name="edit"
            size={25}
            color={Colors.background}
            onPress={() => {
              console.log('-Edit Profile Handler');
              if (adminPasswordExists) {
                setEditPromptVisibility(true);
              } else {
                navigateToEdit();
              }
            }}
          />
        </View>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    // marginTop:20,
    backgroundColor: Colors.fontLight,
  },
  upperContainer: {
    width: '95%',
    height: 125,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    margin: '2.5%',
  },
  lowerContainer: {
    height: '77.5%',
    justifyContent: 'center',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  largeBoldText: {
    margin: 2,
    fontSize: 24,
    fontWeight: 'bold',
  },
  smallBoldText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addContainer: {
    alignItems: 'center',
    height: 150,
    margin: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MerchantHomeScreen;
