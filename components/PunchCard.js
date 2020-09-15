import React from 'react';
import { View, StyleSheet } from 'react-native';

const PunchCard = (props) => (
  <View style={{ ...styles.card, ...props.style }}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    // flex:1,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    // backgroundColor:'white',
    elevation: 7,
    // padding:20,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PunchCard;
