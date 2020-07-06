import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Dialog from 'react-native-dialog'
import Colors from '../../constants/Colors';
import TransactionList from '../../components/TransactionList';

const AuditScreen = props => {
    console.log('Audit')
    const r_item = useSelector(state => state.merchants.myMerchant);
    const [authenticated, setAuthenticated] = useState(false);
    const [promptVisibility, setPromptVisibility] = useState(false)
    const [adminPasswordInput, setAdminPasswordInput] = useState('')
    return (
        <View style={styles.screen}>
            <View style={styles.upperContainer}>
                <View style={styles.rowContainer}>
                    <Text style={{...styles.smallBoldText, width:'35%', textAlign:'center'}}>Date/Time</Text>
                    <Text style={{...styles.smallBoldText, width:'25%'}}>Customer</Text>
                    <Text style={{...styles.smallBoldText, width:'20%'}}>Reward</Text>
                    <Text style={{...styles.smallBoldText, width:'20%', textAlign:'center'}}>Amount</Text>
                </View>
            </View>
            <View style={styles.lowerContainer}>
                {authenticated && <TransactionList transactions={r_item.transactions}/>}
                {!authenticated && <View styles={{width:'95%'}}>
                    <Text style={styles.warningText}>You are not authorized to view transaction details. Please use the button below to authenticate administrator access.</Text>
                    <Button title='Authenticate' color={Colors.primary} onPress={() => setPromptVisibility(true)}/>
                </View>}
                {authenticated && <Button title='Deauthenticate' color={Colors.primary} onPress={() => setAuthenticated(false)}/>}
                <Dialog.Container visible={promptVisibility}>
                    <Dialog.Title style={{fontWeight:'bold'}}>Verification Required!</Dialog.Title>
                    <Dialog.Description>
                        Please enter your administrator password to access the audit screen...
                    </Dialog.Description>
                    <Dialog.Input 
                        style={{borderBottomWidth: Platform.OS == 'android' ? 1: 0, color: Colors.borderDark}}
                        autoCorrect={false}
                        autoCompleteType='off'
                        onChangeText={(text) => {
                            console.log("-Input Change Handler")
                            setAdminPasswordInput(text)
                        }}
                        autoCapitalize = "none"
                        secureTextEntry
                    />
                    <Dialog.Button label="Cancel" onPress={() => {
                        console.log('-Cancel Pressed')
                        setPromptVisibility(false)
                        setAdminPasswordInput('')
                    }}/>
                    <Dialog.Button label="Confirm" onPress={() => {
                        if(adminPasswordInput === r_item.adminPassword){
                            setAuthenticated(true)
                        }else{
                            Alert.alert(
                                'Wrong Password!',
                                'Please try again...', 
                                [{text: 'Okay'}]
                            );
                        };
                        setAdminPasswordInput('')
                        setPromptVisibility(false)
                    }}/>
                </Dialog.Container>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        //marginTop:20,
        backgroundColor:Colors.fontLight,
    }, 
    upperContainer:{
        width:'95%',
        height:'5%',
        justifyContent:'center',
        backgroundColor:Colors.primary,
        borderRadius:3,
        top:'2.5%',
    },
    lowerContainer:{
        top:'2.5%',
        width:'95%',
        height:'92.5%',
    },
    rowContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems:'center'
    },
    warningText:{
        textAlign:'center',
        marginTop:10
    },
    smallBoldText:{
        //marginLeft:5,
        fontWeight:'bold',
    },
})
export default AuditScreen;