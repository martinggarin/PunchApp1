import React from 'react';
import { View, Text, StyleSheet, Flatlist, TextInput } from 'react-native';

const LoginScreen = props => {
    return(
        <View style={styles.screen}>
            <Text>
                This is the Login Screen
            </Text>
            <TextInput  >
            </TextInput>
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
    }
});

export default LoginScreen;