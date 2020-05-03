import React from 'react';
import {View , Text, StyleSheet} from 'react-native';


const ScanScreen = props => {
    onSuccess = e => {
        console.log(e.data);
      };
   
    return (
        <View>
            <Text>
                This is the Scan Screen!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({});

export default ScanScreen;