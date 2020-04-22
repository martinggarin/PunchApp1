import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MerchantLoginScreen = props => {
    return(
        <View style={styles.screen}>
            <Text>
                This is the Merchant Login Screen
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
    }
});

export default MerchantLoginScreen;