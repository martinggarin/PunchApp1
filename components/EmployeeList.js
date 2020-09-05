import React from 'react';
import {
  StyleSheet, FlatList, View,
} from 'react-native';
import Colors from '../constants/Colors';
import EmployeeItem from './EmployeeItem';

const EmployeeList = (props) => {
  let employeeData;
  if (!(props.employeeData === undefined)) {
    employeeData = props.employeeData;
  } else {
    employeeData = [];
  }

  const renderEmployee = (itemData) => (
    <View style={styles.container}>
      <EmployeeItem
        name={itemData.item.name}
        location={itemData.item.location}
        type={itemData.item.type}
        id={itemData.item.id}
        onClick={() => {
          props.onTap(itemData.item.code);
        }}
        color={Colors.background}
      />
    </View>
  );

  return (
    <FlatList
      data={employeeData}
      renderItem={renderEmployee}
      keyExtractor={(item) => item.name}
      ListFooterComponent={props.footer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: '100%',
    alignContent: 'center',
  },
});

export default EmployeeList;
