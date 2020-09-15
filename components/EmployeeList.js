import React from 'react';
import {
  StyleSheet, FlatList, View, Text, TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';

const EmployeeList = (props) => {
  let employeeData;
  if (!(props.employeeData === undefined)) {
    employeeData = props.employeeData;
  } else {
    employeeData = [];
  }

  const renderEmployee = (itemData) => (
    <TouchableOpacity onPress={() => props.onTap(itemData.item.code)}>
      <View style={styles.rowContainer}>
        <View style={styles.leftView}>
          <Text style={styles.lightText}>{`#${itemData.item.code}`}</Text>
          <Text style={styles.boldText}>{itemData.item.name}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>
            Location:
            {` ${itemData.item.location}`}
          </Text>
          <Text>
            Type:
            {` ${itemData.item.type}`}
          </Text>
          <Text>
            ID:
            {` ${itemData.item.id}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={{ width: '100%' }}
      data={employeeData}
      renderItem={renderEmployee}
      keyExtractor={(item) => item.name}
      ListFooterComponent={props.footer}
    />
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftView: {
    width: '35%',
    alignItems: 'center',
    marginRight: 10,
  },
  lightText: {
    color: Colors.darkLines,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default EmployeeList;
