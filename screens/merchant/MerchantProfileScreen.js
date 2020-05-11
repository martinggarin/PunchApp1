import React, {useCallback} from 'react';
import { Alert, View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import { Feather, Ionicons} from '@expo/vector-icons';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';

const MerchantProfileScreen = props => {
    //get the param of email
    const email = props.navigation.getParam('email');
    const r_item = useSelector(state => state.merchants.myMerchant);
    const deals = useSelector(state => state.merchants.myDeals);
    if (deals === undefined){
        totalDeals = 0
    }
    else{
        totalDeals = deals.length
    }

    console.log('merchant profile');
    console.log(r_item);

    const dealTapHandler = useCallback((dealCode) => {
        Alert.alert(
            deals[dealCode].reward+" Deal Selected",
            deals[dealCode].ammount+" points will be deducted from the customer's loyalty point balance",
            [
                { text: "Cancel", onPress: () => {console.log('Cancel Pressed')}, style:'cancel'},
                { text: "Confirm", onPress:  () => {props.navigation.navigate('Scan', {ammount:deals[dealCode].ammount})}}
                
            ],
            { cancelable: true }
        ); 
    })

    const footer = (
        <TouchableOpacity
            onPress={()=> {props.navigation.navigate('UpdateDeal', {id:r_item.id, deals:deals, dealCode:totalDeals})}}
            style={styles.addContainer}
        >
            <View style={styles.addContainer}>
                <Ionicons name={'md-add-circle'} size={30} color={'black'} />
                <Text>Add Deal</Text>
            </View>
        </TouchableOpacity>
    )

    return(
        <View style={styles.screen}>
            <View style={{width:'95%', height:'20%', backgroundColor:Colors.backgrounddark, borderRadius:3, margin:'2.5%'}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems:'center', justifyContent:'space-between'}}>
                    <View style={{left:10}}>
                        <Text style={{margin:2, fontSize:24, fontWeight:'bold',}}>
                            {r_item.title}
                        </Text>
                        <Text>{r_item.price} • {r_item.type}</Text>
                        <Text style={styles.addressText}>{r_item.address} • {r_item.city}</Text>
                    </View>
                    <View style={{right:15}}>
                        <View>
                            <Text style={{fontWeight:'bold', textAlign:'center'}}>Total Deals</Text>
                            <Text style={{textAlign:'center'}}>{totalDeals}</Text>
                        </View>
                        <View>
                            <Text style={{fontWeight:'bold', textAlign:'center'}}>Customers</Text>
                            <Text style={{textAlign:'center'}}>{totalDeals}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{height:'75%',justifyContent:'center'}}>
                <DealList
                    dealData={deals}
                    onTap={dealTapHandler}
                    footer={footer}
                    merchantSide={true}
                />
            </View>
        </View>
    );
};

MerchantProfileScreen.navigationOptions = navigationData => {
    return{
        headerRight: () => {
            return (
                <Feather 
                    name='edit'
                    size={25}
                    color={Colors.lightLines}
                    style={{marginRight:10}}
                    onPress={()=>{navigationData.navigation.navigate('Edit')}}
                />
            )
        }
    }
}
            
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        //marginTop:20,
        backgroundColor:Colors.fontLight,
    }, 
    addContainer:{
        alignItems:'center',
        height:150,
        margin:10,
    }
});

export default MerchantProfileScreen;