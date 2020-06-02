import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-generator';
import Colors from '../../constants/Colors';

const RewardScreen = props => {
    const u_id = useSelector(state => state.user.user.id);
    //console.log('------ID--------');
    //console.log(u_id);
    return (
        <View style={styles.screen}>
            <Text>
                Scan this QR Code to process rewards!
            </Text>
            <QRCode value={u_id} size={250}/>
        </View>
        
    );
};
        
            
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.background,
    },
    image:{
        width:'80%',
        height:'50%',
        resizeMode:'contain'
    },
    text:{
        color:Colors.fontLight
    }
});

export default RewardScreen;