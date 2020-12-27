import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../constants/Colors';

const RewardBalance = (props) => {
  const { size } = props;
  const textColor = (props.textColor) ? props.textColor : Colors.darkLines;
  const numberColor = (props.numberColor) ? props.numberColor : Colors.primary;
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: size, color: textColor }}>{props.text[0]}</Text>
        <Text style={{ fontSize: size, color: textColor }}>{props.text[1]}</Text>
      </View>
      <View style={{ marginLeft: 5 }}>
        <Text style={{ fontSize: size * 3, color: numberColor }}>{props.number}</Text>
      </View>
    </View>
  );
};

export default RewardBalance;
