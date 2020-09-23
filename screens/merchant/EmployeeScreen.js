import React, {
  useCallback,
} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import EmployeeList from '../../components/EmployeeList';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';

const EmployeeScreen = (props) => {
  console.log('Employee');
  const merchant = useSelector((state) => state.merchants.myMerchant);
  const dispatch = useDispatch();
  let employees = useSelector((state) => state.merchants.myEmployees);

  let totalEmployees;
  if (employees === undefined || employees === null) {
    totalEmployees = 0;
    employees = [];
  } else {
    totalEmployees = employees.length;
  }

  const employeeTapHandler = useCallback((employeeCode) => {
    Alert.alert(
      employees[employeeCode].name,
      'What would you like to do?',
      [{
        text: 'Edit',
        onPress: () => {
          console.log('-Employee Edit Handler');
          props.navigation.navigate('UpdateEmployee', { id: merchant.id, employees, employeeCode });
        },
      }, {
        text: 'Remove',
        onPress: () => {
          console.log('-Employee Remove Handler');
          dispatch(MerchantActions.removeEmployee(merchant.id, employeeCode));
        },
      }, {
        text: 'Cancel',
        onPress: () => { console.log('-Cancel Pressed'); },
        style: 'cancel',
      }],
      { cancelable: true },
    );
  });

  const footer = (
    <TouchableOpacity
      onPress={() => {
        console.log('-Employee Add Handler');
        props.navigation.navigate('UpdateEmployee', { id: merchant.id, employees, employeeCode: totalEmployees });
      }}
      style={styles.addContainer}
    >
      <View style={styles.addContainer}>
        <Ionicons name="md-add-circle" size={30} color={Colors.fontDark} />
        <Text>Add Employee</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <EmployeeList
          employeeData={employees}
          onTap={employeeTapHandler}
          footer={footer}
        />
      </View>
    </View>
  );
};

EmployeeScreen.navigationOptions = () => ({
  title: 'Employees',
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: Colors.background,
  },
  container: {
    height: '100%',
    width: '95%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
  },
  addContainer: {
    alignItems: 'center',
  },
});

export default EmployeeScreen;
