import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserLoginScreen = props => {
    return(
        <View style={styles.screen}>
            <Text>
                This is the User Login Screen
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
    }
});

export default UserLoginScreen;