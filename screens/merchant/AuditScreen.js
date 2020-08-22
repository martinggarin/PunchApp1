import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import CodeInput from 'react-native-confirmation-code-input';
import Dialog from 'react-native-dialog'
import Colors from '../../constants/Colors';
import TransactionList from '../../components/TransactionList';

const AuditScreen = props => {
    console.log('Audit')
    const r_item = useSelector(state => state.merchants.myMerchant);
    const employees = useSelector(state => state.merchants.myEmployees);
    const [authenticated, setAuthenticated] = useState(false);
    const [promptVisibility, setPromptVisibility] = useState(false);
    return (
        <View style={styles.screen}>
            <View style={styles.lowerContainer}>
                {authenticated && <TransactionList transactions={r_item.transactions}/>}
                {!authenticated && <View style={styles.authenticationContainer}>
                    <Text style={styles.warningText}>You are not authorized to view transaction details. Please use the button below to authenticate manager access.</Text>
                    <View style={styles.buttonContainer}>
                        <Button title='Authenticate' color={Colors.primary} onPress={() => setPromptVisibility(true)}/>
                    </View>
                </View>}
                {authenticated && <View style={styles.authenticationContainer}>
                    <View style={styles.buttonContainer}>
                        <Button title='Deauthenticate' color={Colors.primary} onPress={() => setAuthenticated(false)}/>
                    </View>
                </View>}
                <Dialog.Container visible={promptVisibility}>
                    <Dialog.Title style={styles.boldText}>Verification Required!</Dialog.Title>
                    <Dialog.Description>
                        Please enter a manager ID to access the audit screen...
                    </Dialog.Description>
                    <View>
                        <View style={styles.authenticationInputContainer}>
                            <CodeInput
                                style={styles.authenticationInput}
                                secureTextEntry
                                keyboardType="numeric"
                                codeLength={4}
                                autoFocus={true}
                                compareWithCode='aaaa'
                                onFulfill={(isValid, code) => {
                                    var employee = null
                                    for (const key in employees){
                                        if ((employees[key].id === code) && (employees[key].type === 'Manager')){
                                            console.log('success')
                                            employee = employees[key]
                                        }
                                    }
                                    if(employee){
                                        setPromptVisibility(false)
                                        setAuthenticated(true)
                                    }else{
                                        Alert.alert(
                                            'Invalid ID!',
                                            'Please try again...', 
                                            [{text: 'Okay'}]
                                        );
                                    };
                                }}
                            />
                        </View>
                    </View>
                    <Dialog.Button label="Cancel" onPress={() => {
                        console.log('-Cancel Pressed')
                        setPromptVisibility(false)
                    }}/>
                </Dialog.Container>
            </View>
        </View>
    )
}

AuditScreen.navigationOptions = navData => {
    return {
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title="Menu" iconName='md-menu' onPress={()=>{
                    navData.navigation.toggleDrawer();
                }} />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        //marginTop:20,
        backgroundColor:Colors.fontLight,
    }, 
    lowerContainer:{
        top:'2.5%',
        width:'95%',
        height:'92.5%',
        alignItems:'center'
    },
    rowContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems:'center'
    },
    authenticationContainer:{
        alignItems:'center',
    },
    authenticationInputContainer:{
        height:30,
        marginBottom:10
    },
    authenticationInput:{
        borderWidth:1,
        height:'100%',
        height:30,
        width:30,
        marginTop:-20,
        marginLeft:5,
        marginRight:5,
        textAlign:'center',
        color:'black'
    },
    buttonContainer:{
        width:'60%',
        marginTop:5,
    },
    warningText:{
        textAlign:'center',
        marginTop:10
    },
    boldText:{
        fontWeight:'bold',
    }
})
export default AuditScreen;