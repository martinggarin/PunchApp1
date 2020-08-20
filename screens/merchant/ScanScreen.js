import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {useDispatch, useSelector} from 'react-redux';
import Dialog from 'react-native-dialog'
import CodeInput from 'react-native-confirmation-code-input';
import * as userActions from '../../store/actions/user';
import * as merchantActions from '../../store/actions/merchants';
import Colors from '../../constants/Colors';

const ScanScreen = props => {
    console.log('Scan')
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(false);
    const [promptVisibility, setPromptVisibility] = useState(false)
    const [input, setInput] = useState('1')
    const dispatch = useDispatch();
    const r_id = useSelector(state => state.merchants.myMerchant.id);
    const employees = useSelector(state => state.merchants.myEmployees);
    const reward = props.navigation.getParam('reward');
    const amount = props.navigation.getParam('amount');

    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    const handleInput = (value) => {
        console.log('-Input Change Handler')
        setInput(value)
    };

    const handleRewards = async (data, employee) =>{
        if(!(amount === undefined)){
            try{
                await dispatch(userActions.updateRewards(r_id, data, -amount))
            }catch(err){
                if (err === 'insufficient'){
                    await dispatch(merchantActions.addTransaction(r_id, employee, data, 'Insufficient Balance', reward))
                    Alert.alert(
                        "Insufficient Balance",
                        "Unable to subtract "+amount+" points from user:\n"+data,
                        [
                            { text: "Ok",  onPress: () => {
                                props.navigation.goBack()
                            }},
                        ],
                        { cancelable: false }
                    ); 
                }else if(err === 'none'){
                    await dispatch(merchantActions.addTransaction(r_id, employee, data, -amount, reward))
                    Alert.alert(
                        "Deal Redeemed",
                        amount+" point(s) subtracted from user:\n"+data,
                        [
                            { text: "Ok", onPress: () => {
                                props.navigation.goBack()
                            }},
                        ],
                        { cancelable: false }
                    );
                }else{
                    Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
                }
            }
        }else{
            try{
                // console.log('_________Updating Rewards__________');
                // console.log('R_id: ' + r_id);
                // console.log('U_ID: ' + data); 
                await dispatch(userActions.updateRewards(r_id, data, Number(input)));
            }catch(err){
                if (err === 'none'){
                    await dispatch(merchantActions.addTransaction(r_id, employee, data, Number(input)))
                    await dispatch(merchantActions.updateCustomers(r_id, data))
                    await dispatch(userActions.toggleFav(r_id, data, true))
                    Alert.alert(
                        "Reward Redeemed",
                        input+" point(s) added to user: "+data,
                        [
                            { text: "Ok"},
                        ],
                        { cancelable: false }
                    );
                }else{
                    Alert.alert('An error occurred!', err.message, [{ text: 'Okay' }]);
                }
            }
        };
    }

    const handleBarCodeScanned = async ({ type, data })  => {
        setScanned(true)
        if (data.length === 28){
            setScannedData(data)
            setPromptVisibility(true)
        }else{
            Alert.alert('Invalid QR Code', 'Please try again', [{ text: 'Okay' }]);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
   
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.screen}>
                <BarCodeScanner 
                    style={styles.scanner}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                />
                {scanned && <View style={styles.button}> 
                    <Button title={'Scan Again?'} titleColor={Colors.fontDark} color={Colors.primary} onPress={() => setScanned(false)} />
                </View>}
                {(amount === undefined) && <View style={styles.inputContainer}>
                    <Text style={styles.text}>Points to Credit Customer</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            keyboardType = 'numeric'
                            keyboardDismissMode = 'interactive'
                            returnKeyType='done'
                            //placeholder = "Loyalty Points"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {input.toString()}
                            autoCapitalize = "none"
                            onChangeText = {handleInput}
                            textAlign = "center"
                        />  
                    </View> 
                </View>}
                <Dialog.Container visible={promptVisibility}>
                    <Dialog.Title style={{fontWeight:'bold'}}>Confirmation Required!</Dialog.Title>
                    <Dialog.Description>
                        You are about to complete a transaction. Enter your employee identification number to continue...
                    </Dialog.Description>
                    <View>
                        <View style={{height:30, marginBottom:10}}>
                            <CodeInput
                                style={{borderWidth:1, height:'100%', height:30, width:30, marginTop:-20, marginLeft:5, marginRight:5, textAlign:'center', color:'black'}}
                                secureTextEntry
                                keyboardType="numeric"
                                codeLength={4}
                                autoFocus={true}
                                compareWithCode='aaaa'
                                onFulfill={(code) => {
                                    var employee = null
                                    for (const key in employees){
                                        if (employees[key].id === code){
                                            employee = employees[key]
                                        }
                                    }
                                    if(employee){
                                        setPromptVisibility(false)
                                        handleRewards(scannedData, employee)
                                    }else{
                                        Alert.alert(
                                            'Unknown Employee!',
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
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        backgroundColor: Colors.scanBackground,
        //justifyContent:'center'
    },
    scanner:{
        ...StyleSheet.absoluteFill,
        height:"100%",
    },
    inputContainer:{
        width:'55%',
        height:60,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:Colors.primary,
        borderRadius:3,
        top:'2.5%',
        
    },
    inputView:{
        marginLeft:2,
        marginRight:2,
        borderColor: Colors.borderLight,
        borderWidth: 1,
        height:30,
        width:50,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:5
    },
    input: {
        color:Colors.fontLight,
        height:30,
        width:50
    },   
    text: {
        fontSize: 14,
        fontWeight: "bold",
        color:Colors.fontLight,
        marginTop:5
    },
    button:{
        ...StyleSheet.absoluteFill,
        height:50,
        width:'55%',
        top:'90%',
        marginLeft:'22.5%',
        marginRight:'22.5%'
        
    }

});

export default ScanScreen;