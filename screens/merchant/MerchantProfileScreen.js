import React, {useCallback} from 'react';
import { Alert, View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import { Feather, Ionicons} from '@expo/vector-icons';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';

const MerchantProfileScreen = props => {
    console.log('Merchant Profile');
    const r_item = useSelector(state => state.merchants.myMerchant);
    //console.log(r_item)

    let deals = useSelector(state => state.merchants.myDeals);
    if (deals === undefined || deals === null){
        var totalDeals = 0
        deals = []
    }
    else{
        var totalDeals = deals.length
    }
    if (r_item.customers === undefined || r_item.customers === null){
        var totalCustomers = 0
        r_item.customers = []
    }
    else{
        var totalCustomers = r_item.customers.length
    }

    const dealTapHandler = useCallback((dealCode) => {
        Alert.alert(
            deals[dealCode].reward+" Deal Selected",
            deals[dealCode].ammount+" point(s) will be deducted from the customer's loyalty point balance",
            [
                { 
                    text: "Cancel",
                    onPress: () => {console.log('-Cancel Pressed')}, style:'cancel'
                },
                { 
                    text: "Confirm",
                    onPress:  () => {
                        console.log('-Scan Handler')
                        props.navigation.navigate('Scan', {ammount:deals[dealCode].ammount})
                    }
                }
                
            ],
            { cancelable: true }
        ); 
    })

    const footer = (
        <TouchableOpacity
            onPress={()=> {
                console.log('-Add Deal Handler')
                props.navigation.navigate('UpdateDeal', {id:r_item.id, deals:deals, dealCode:totalDeals})
            }}
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
            <View style={styles.upperContainer}>
                <View style={styles.rowContainer}>
                    <View style={{left:10}}>
                        <Text style={styles.largeBoldText}>
                            {r_item.title}
                        </Text>
                        <Text>{r_item.price} • {r_item.type}</Text>
                        <Text style={styles.addressText}>{r_item.address} • {r_item.city}</Text>
                    </View>
                    <View style={{right:15}}>
                        <View>
                            <Text style={styles.smallBoldText}>Total Deals</Text>
                            <Text style={{textAlign:'center'}}>{totalDeals}</Text>
                        </View>
                        <View>
                            <Text style={styles.smallBoldText}>Customers</Text>
                            <Text style={{textAlign:'center'}}>{totalCustomers}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.lowerContainer}>
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
                <View style={{flex:1, flexDirection:'row', width:100}}>
                    <View style={{height:'100%', width:'50%', alignItems:'center', justifyContent:'center'}}>
                        <Feather
                            name='help-circle'
                            size={25}
                            color={Colors.lightLines}
                            onPress={()=>{
                                Alert.alert(
                                    'Merchant Help',
                                    'Thank you for using PunchApp! We hope you are enjoying your experience.\n\n'
                                    +'• Deals can be created on both the home and edit screens\n\n'
                                    +'• To edit or remove a deal, select it on the edit screen\n\n'
                                    +'• To credit loyalty points to a customer account, scan their reward code using the scanning tab\n\n'
                                    +'• To redeem a deal for a customer, select it on the home screen and scan their reward code\n\n'
                                    +'• Profile information can be updated on the edit screen at any time',
                                    [{text: 'Okay'}]
                                )
                            }}
                        />
                    </View>
                    <View style={{height:'100%', width:'50%', alignItems:'center', justifyContent:'center'}}>
                        <Feather 
                            name='edit'
                            size={25}
                            color={Colors.lightLines}
                            onPress={()=>{
                                console.log('-Edit Profile Handler')
                                navigationData.navigation.navigate('Edit')
                            }}
                        />
                    </View>
                </View>
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
    upperContainer:{
        width:'95%',
        height:'20%',
        backgroundColor:Colors.backgrounddark,
        borderRadius:3,
        margin:'2.5%'
    },
    lowerContainer:{
        height:'77.5%',
        justifyContent:'center'
    },
    rowContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    largeBoldText:{
        margin:2, 
        fontSize:24,
        fontWeight:'bold'
    },
    smallBoldText:{
        fontWeight:'bold',
        textAlign:'center'
    },
    addContainer:{
        alignItems:'center',
        height:150,
        margin:10,
    }
});

export default MerchantProfileScreen;