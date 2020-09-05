import React from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';

const EmployeeItem = (props) => (
  <TouchableOpacity onPress={props.onClick}>
    <View style={{
      justifyContent: 'center', borderColor: Colors.lightLines, borderBottomWidth: 1, height: '100%',
    }}
    >
      <View style={{
        flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10,
      }}
      >
        <View style={{ width: '50%' }}>
          <Text style={{ fontSize: 18 }}>{props.name}</Text>
        </View>
        <View style={{ width: '25%' }}>
          <Text style={{ fontSize: 18 }}>{props.location}</Text>
        </View>
        <View style={{ width: '10%' }}>
          <Text style={{ fontSize: 18, textAlign: 'center' }}>{props.type[0]}</Text>
        </View>
        <View style={{ width: '15%' }}>
          <Text style={{ fontSize: 18, textAlign: 'center' }}>{props.id}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default EmployeeItem;
