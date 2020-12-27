import React from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';

const DealItem = (props) => (
  <TouchableOpacity onPress={props.onClick}>
    <View style={{
      justifyContent: 'center', borderColor: Colors.lightLines, borderBottomWidth: 1, height: '100%',
    }}
    >
      <View style={{
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%',
      }}
      >
        <View>
          <Text style={{ fontSize: 21, color: Colors.primary }}>{props.title}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {props.children}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default DealItem;
