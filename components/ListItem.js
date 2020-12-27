import React from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';

const ListItem = (props) => (
  <TouchableOpacity onPress={props.onClick}>
    <View style={{ justifyContent: 'center' }}>
      <View
        style={{ ...styles.outsideContainer, ...{ backgroundColor: props.color }, ...props.style }}
      >
        <View style={{ ...styles.insideContainer, ...props.insideContainerStyle }}>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{props.title}</Text>
            <View style={styles.priceTextContainer}>
              <Text style={styles.priceText}>
                {props.price}
                {' '}
                •
                {' '}
                {props.type}
              </Text>
            </View>
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressText}>
                {props.address}
                {' '}
                •
                {' '}
                {props.city}
              </Text>
            </View>
          </View>
          <View style={styles.containerRight}>

            {props.children}
          </View>
        </View>
      </View>
      <View style={styles.border} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  outsideContainer: {
    flex: 1,
    marginHorizontal: 10,
    // marginVertical:10,
    marginTop: 5,
    height: 100,
    // justifyContent:'space-between',
    alignItems: 'center',
    borderRadius: 5,
    // elevation:2,
    overflow: 'hidden',
    flexDirection: 'row',
    // borderColor:Colors.darkLines,
    // borderWidth:1,

    // borderColor:Colors.primary
  },
  containerRight: {
    // borderWidth:1,
    // flex:1,
    width: '50%',
    alignItems: 'center',
  },
  distanceContainer: {
    borderWidth: 1,
    marginTop: 0,
  },
  insideContainer: {
    // margin:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems:'center',
    width: '91%',
    // padding:10,
    // borderRadius:5,
  },
  border: {
    // flex:1,
    // borderWidth:1,
    height: 1,
    // borderBottomStartRadius: 50,
    marginStart: '3%',
    borderColor: Colors.lightLines,
    borderBottomWidth: 1,
    width: '94%',
  },
  tItems: {
    overflow: 'hidden',
  },
  titleText: {
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  textContainer: {
    width: '70%',
    borderColor: Colors.borderDark,
    // borderWidth:1,
    flexDirection: 'column',
  },
  addressTextContainer: {
  },
  addressText: {
    color: Colors.darkLines,
  },
  priceText: {
    color: Colors.darkLines,
  },
  priceTextContainer: {},

});

export default ListItem;
