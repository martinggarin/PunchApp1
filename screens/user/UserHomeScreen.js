import React from 'react';
import { StyleSheet, TouchableOpacity, View, SafeAreaView } from 'react-native';
import {useSelector} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import MerchantList from '../../components/MerchantList';


const UserHomeScreen = props => {
    const footer = (<TouchableOpacity
        onPress={()=> props.navigation.navigate('NewMerchant')}
        style={styles.addContainer}
    >
        <View style={styles.addContainer}>
            <Ionicons name={'md-add-circle'} size={50}/>
        </View>
    </TouchableOpacity>);

    const display = useSelector(state => state.merchants.userRestaurants);
    return(
        <SafeAreaView
        style={styles.screen}>
            <MerchantList 
                listData={display}
                navigation={props.navigation}
                routeName={'Punch'}
                style={styles.merchantList}
                color={Colors.background}
                footer={footer}
            />
        </SafeAreaView>
    );
};
UserHomeScreen.navigationOptions = navData => {

    return {
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title="Menu" iconName='md-menu' onPress={()=>{
                    navData.navigation.toggleDrawer();
                }} />
            </HeaderButtons>
        ),
        headerRight:() => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title="Menu" iconName='md-add' onPress={()=>{
                    navData.navigation.navigate('NewMerchant');
                }} />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.background,//this is the color for everything need to fix
    },
    addContainer:{
        alignItems:'center',
        height:150,
        margin:10,
        
    }, 
    merchantList:{
        flex:1
    }
});

export default UserHomeScreen;