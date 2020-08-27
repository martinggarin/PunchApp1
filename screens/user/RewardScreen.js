import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import QRCode from 'react-native-qrcode-generator';
import Colors from '../../constants/Colors';

const RewardScreen = props => {
    console.log('Reward');
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
        
RewardScreen.navigationOptions = navData => {
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