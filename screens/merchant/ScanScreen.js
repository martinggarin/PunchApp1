import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {useDispatch, useSelector} from 'react-redux';
import * as userActions from '../../store/actions/user';
import Colors from '../../constants/Colors';

const ScanScreen = props => {
    const [ammount, setAmmount] = useState(props.navigation.state.params);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const dispatch = useDispatch();
    const r_id = useSelector(state => state.merchants.myMerchant.id);

    //const ammount = props.navigation.getParam('ammount');
    useEffect(()=>{
        setAmmount(props.navigation.state.params);
    },[props])
    console.log('__________ammount________');
    if(!(ammount.params === undefined))
        {console.log(ammount.params.Ammount);}
    console.log(ammount);
    
    useEffect(() => {
        
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data })  => {
        setScanned(true);
        if(!(ammount.params === undefined)){
            try{
                // console.log('_________Updating Rewards__________');
                // console.log('R_id: ' + r_id);
                // console.log('U_ID: ' + data); 

                await dispatch(userActions.updateRewards(r_id, data, -ammount.params.Ammount))
                setAmmount(0);
                props.navigation.goBack();
                
                //need to handle error if user doesn't have enough rewards... 
            }catch(err){
                console.log('there was an error')
            }
            alert(`Deal Redeemd!!  \n${ammount.params.Ammount} Subtracted from User: ${data}!`);

        }else{
            try{
                // console.log('_________Updating Rewards__________');
                // console.log('R_id: ' + r_id);
                // console.log('U_ID: ' + data); 

                await dispatch(userActions.updateRewards(r_id, data, 1));
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
            <BarCodeScanner style={styles.scanner}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />

        {scanned && <View style={styles.button}> <Button title={'Scan Again?'} color={Colors.backgrounddark} onPress={() => setScanned(false)} /> </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    scanner:{
        ...StyleSheet.absoluteFill,
        height:"95%",
        top:20
    },
    button:{
        height:50,
        width:100
    }

});

export default ScanScreen;