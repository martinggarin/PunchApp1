import React from 'react';
import { View, Text, StyleSheet, Button , TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';


const MerchantProfileScreen = props => {
    //get the param of email
    const email = props.navigation.getParam('email');
    const r_item = useSelector( state=> state.merchants.availableRestaurants).find(r=>r.email === email);

    const footer = (
        <TouchableOpacity
            onPress={()=> props.navigation.navigate('AddDeal')}
            style={styles.addContainer}
        >
        <View style={styles.addContainer}>
            <Ionicons name={'md-add-circle'} size={50} color={'black'} />
        </View>
        </TouchableOpacity>
        );

    return(
        <View style={styles.screen}>
            <Text style={styles.text}>
                 {r_item.title}
            </Text>

            <DealList 
                dealData={r_item.deal}
                footer={footer}
            />
        </View>
    );
};
MerchantProfileScreen.navigationOptions = navData => {
    
    return {
        headerTitle:'Merchant Home',
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
        paddingTop:20,
        backgroundColor:Colors.background,
    }, 
    addContainer:{
        alignItems:'center',
        height:150,
        margin:10,
    }, 
    text:{
        fontSize:20,
        color:Colors.lines
    }
});

export default MerchantProfileScreen;