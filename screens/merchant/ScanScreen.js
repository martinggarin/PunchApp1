import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Colors from '../../constants/Colors';

const ScanScreen = props => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
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
                Scan a customer QR Code to credit 1 point
            </Text>
            <BarCodeScanner style={styles.scanner}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            />
            {scanned && <Button title='New Customer' color={Colors.backgrounddark} onPress={() => setScanned(false)} />}
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
    height:480,
    top:20

  }
});

export default ScanScreen;