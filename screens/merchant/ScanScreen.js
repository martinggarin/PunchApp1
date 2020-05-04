import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {useDispatch, useSelector} from 'react-redux';
import * as userActions from '../../store/actions/user';
import Colors from '../../constants/Colors';

const ScanScreen = props => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const dispatch = useDispatch();
    const r_id = useSelector(state => state.merchants.myMerchant.id);
    
    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try{
        console.log('_________Updating Rewards__________');
        console.log('R_id: ' + r_id);
        console.log('U_ID: ' + data); 

        dispatch(userActions.updateRewards(r_id, data, 1));
    }catch(err){
        console.log('there was an error')
    }
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
   
    return (
        <View style={styles.screen}>
            <Text>
                Scan a customer QR Code to credit rewards!
            </Text>
            <BarCodeScanner style={styles.scanner}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />

        {scanned && <Button title={'New Customer'} color={Colors.backgrounddark} onPress={() => setScanned(false)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
    },
    scanner:{
        ...StyleSheet.absoluteFill,
        height:"95%",
        top:20
    }
});

export default ScanScreen;