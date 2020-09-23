import React, { useCallback, useState } from 'react';
import {
  Text, View, StyleSheet, Button, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CodeInput from 'react-native-confirmation-code-input';
import Dialog from 'react-native-dialog';
import HeaderButton from '../../components/HeaderButton';
import Colors from '../../constants/Colors';
import TransactionList from '../../components/TransactionList';
import * as MerchantActions from '../../store/actions/merchants';
import * as UserActions from '../../store/actions/user';

const AuditScreen = (props) => {
  console.log('Audit');
  const merchant = useSelector((state) => state.merchants.myMerchant);
  const employees = useSelector((state) => state.merchants.myEmployees);
  const [authenticated, setAuthenticated] = useState(false);
  const [promptVisibility, setPromptVisibility] = useState(false);

  const dispatch = useDispatch();

  const transactionTapHandler = useCallback((transactionCode) => {
    const transaction = merchant.transactions.find((t) => t.code === transactionCode);
    const action = transaction.reward ? 'added to' : 'subtracted from';

    Alert.alert(
      `Undo Transaction: #${transactionCode}`,
      `${Math.abs(transaction.amount)} point(s) will be ${action} the customer's loyalty point balance`,
      [
        {
          text: 'Cancel',
          onPress: () => { console.log('-Cancel Pressed'); },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await dispatch(
                UserActions.updateRewards(merchant.id, transaction.customerID, -transaction.amount),
              );
            } catch (err) {
              if (err.message === 'insufficient') {
                Alert.alert(
                  'Insufficient Balance',
                  `Unable to subtract ${transaction.amount} points from user:\n${transaction.customerID}`,
                  [
                    { text: 'Ok' },
                  ],
                  { cancelable: false },
                );
              } else if (err.message === 'none') {
                await dispatch(MerchantActions.removeTransaction(merchant.id, transactionCode));
                Alert.alert(
                  'Transaction Reversed',
                  `${Math.abs(transaction.amount)} point(s) ${action} user:\n${transaction.customerID}`,
                  [
                    {
                      text: 'Ok',
                      onPress: () => {
                        props.navigation.goBack();
                      },
                    },
                  ],
                  { cancelable: false },
                );
              } else {
                throw err;
              }
            }
          },
        },
      ],
      { cancelable: true },
    );
  });

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {authenticated && (
          <TransactionList transactions={merchant.transactions} onPress={transactionTapHandler} />
        )}
        {!authenticated && (
          <View style={styles.authenticationContainer}>
            <Text style={styles.warningText}>
              You are not authorized to view transaction details.
              Please use the button below to authenticate manager access.
            </Text>
            <View style={styles.buttonContainer}>
              <Button title="Authenticate" color={Colors.primary} onPress={() => setPromptVisibility(true)} />
            </View>
          </View>
        )}
        {authenticated && (
          <View style={styles.authenticationContainer}>
            <View style={styles.buttonContainer}>
              <Button title="Deauthenticate" color={Colors.primary} onPress={() => setAuthenticated(false)} />
            </View>
          </View>
        )}
        <Dialog.Container visible={promptVisibility}>
          <Dialog.Title style={styles.boldText}>Verification Required!</Dialog.Title>
          <Dialog.Description>
            Please enter a manager ID to access the audit screen...
          </Dialog.Description>
          <View>
            <View style={styles.authenticationInputContainer}>
              <CodeInput
                style={styles.authenticationInput}
                secureTextEntry
                keyboardType="numeric"
                codeLength={4}
                autoFocus
                compareWithCode="aaaa"
                onFulfill={(isValid, code) => {
                  if (employees) {
                    let employee = null;
                    Object.values(employees).forEach((value) => {
                      if (value.id === code && value.type === 'Manager') {
                        employee = value;
                      }
                    });
                    if (employee) {
                      setPromptVisibility(false);
                      setAuthenticated(true);
                    } else {
                      Alert.alert(
                        'Invalid Manager ID!',
                        'Please try again...',
                        [{ text: 'Okay' }],
                      );
                    }
                  } else {
                    Alert.alert(
                      'No Managers!',
                      'Please create a manager type employee from the employee screen before authenticating the audit tab...',
                      [{ text: 'Okay' }],
                    );
                  }
                }}
              />
            </View>
          </View>
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              console.log('-Cancel Pressed');
              setPromptVisibility(false);
            }}
          />
        </Dialog.Container>
      </View>
    </View>
  );
};

AuditScreen.navigationOptions = (navData) => ({
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
    height: '100%',
    backgroundColor: Colors.background,
  },
  container: {
    height: '100%',
    width: '95%',
    alignItems: 'center',
    paddingTop: 10,
  },
  authenticationContainer: {
    marginBottom: 5,
    alignItems: 'center',
  },
  authenticationInputContainer: {
    height: 30,
    marginBottom: 10,
  },
  authenticationInput: {
    borderWidth: 1,
    borderRadius: 3,
    height: 30,
    width: 30,
    marginTop: -20,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: 'black',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 5,
  },
  warningText: {
    textAlign: 'center',
    marginTop: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
export default AuditScreen;
