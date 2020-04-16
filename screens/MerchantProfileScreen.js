import React from 'react';
import { View, Text, StyleSheet, Flatlist } from 'react-native';

const MerchantProfileScreen = props => {
    return(
        <View style={styles.screen}>
            <Text>
                This is the Merchant Profile Screen
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
    }
});

export default MerchantProfileScreen;