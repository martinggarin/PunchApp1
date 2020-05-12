import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {useDispatch, useSelector} from 'react-redux';
import * as userActions from '../../store/actions/user';
import * as merchanActions from '../../store/actions/merchants';
import Colors from '../../constants/Colors';

const ScanScreen = props => {
    console.log('Scan')
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const dispatch = useDispatch();
    const r_id = useSelector(state => state.merchants.myMerchant.id);
    const ammount = props.navigation.getParam('ammount');
    
    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data })  => {
        setScanned(true)
        if(!(ammount === undefined)){
            try{
                // console.log('_________Updating Rewards__________');
                // console.log('R_id: ' + r_id);
                // console.log('U_ID: ' + data); 

                await dispatch(userActions.updateRewards(r_id, data, -ammount))
                //setAmmount(0);
                
            //need to handle error if user doesn't have enough rewards... 
            }catch(err){
                if (err === 'insufficient'){
                    Alert.alert(
                        "Insufficient Balance",
                        "Unable to subtract "+ammount+" points from user: "+data,
                        [
                            { text: "Ok", onPress:  async () => {await props.navigation.goBack()}},
                        ],
                        { cancelable: false }
                    ); 
                }
                else if(err === 'none'){
                    Alert.alert(
                        "Deal Redeemed",
                        ammount+" points subtracted from user: "+data,
                        [
                            { text: "Ok", onPress: () => props.navigation.goBack()},
                        ],
                        { cancelable: false }
                    );
                }
                else {
                    Alert.alert('An error occurred!', err, [{ text: 'Okay' }]);
                }
            }
        }
        else{
            try{
                // console.log('_________Updating Rewards__________');
                // console.log('R_id: ' + r_id);
                // console.log('U_ID: ' + data); 
                await dispatch(userActions.updateRewards(r_id, data, 1));
                await dispatch(merchanActions.updateCustomers(r_id, data));
            }catch(err){
                console.log('there was an error')
            }
            alert(`1 POINT ADDED TO USER: ${data}!`);
        };
    };
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
   
    return (
        <View style={styles.screen}>
            <BarCodeScanner 
                style={styles.scanner}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            />
            {scanned && <View style={styles.button}> 
                <Button title={'Scan Again?'} color={Colors.backgrounddark} onPress={() => setScanned(false)} />
            </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        //justifyContent:'center'
    },
    scanner:{
        ...StyleSheet.absoluteFill,
        height:"100%",
    },
    button:{
        height:50,
        width:'50%',
        marginTop:20
    }

});

export default ScanScreen;