import React, {useCallback, useEffect} from 'react';
import { Alert, View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import { Feather, Ionicons, AntDesign} from '@expo/vector-icons';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';

const MerchantProfileScreen = props => {
    console.log('Merchant Profile');
    const r_item = useSelector(state => state.merchants.myMerchant);
    //console.log(r_item)

    let deals = useSelector(state => state.merchants.myDeals);
    let totalDeals = null
    let totalCustomers = null
    if (deals === undefined || deals === null){
        totalDeals = 0
        deals = []
    }
    else{
        totalDeals = deals.length
    }
    if (r_item.customers === undefined || r_item.customers === null){
        totalCustomers = 0
        r_item.customers = []
    }
    else{
        totalCustomers = r_item.customers.length
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

    useEffect(()=>{
        props.navigation.setParams({deals:totalDeals});
    },[totalDeals]);

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
    const deals = navigationData.navigation.getParam('deals');
    if (deals > 0){
        var published = true
        var iconName = 'checkcircle'
    }else{
        var published = false
        var iconName = 'checkcircleo'
    }
    return{
        headerRight: () => {
            return (
                <View style={styles.headerRight}>
                    <View style={styles.headerButton}>
                        <AntDesign
                            name={iconName}
                            size={25}
                            color={Colors.lightLines}
                            onPress={()=>{
                                Alert.alert(
                                    'Profile Status',
                                    (published)
                                    ? 'Your profile is currently LIVE! Users can find you on the explore page and in their favorites.'
                                    : 'Your profile is currently HIDDEN! Add a deal to publish your profile.',
                                    [{text: 'Okay'}]
                                )
                            }}
                        />
                    </View>
                    <View style={{...styles.headerButton, height:55, width:55}}>
                        <Feather
                            name='help-circle'
                            size={27.5}
                            color={Colors.lightLines}
                            onPress={()=>{
                                Alert.alert(
                                    'Merchant Help',
                                    'Thank you for using PunchApp! We hope you are enjoying your experience.\n\n'
                                    +'• Deals can be created on both the home and edit screens\n\n'
                                    +'• Maintain at least one deal to ensure your profile remains public\n\n'
                                    +'• To edit or remove a deal, select it on the edit screen\n\n'
                                    +'• To credit loyalty points to a customer account, scan their reward code using the scanning tab\n\n'
                                    +'• To redeem a deal for a customer, select it on the home screen and scan their reward code\n\n'
                                    +'• Profile information can be updated on the edit screen at any time',
                                    [{text: 'Okay'}]
                                )
                            }}
                        />
                    </View>
                    <View style={styles.headerButton}>
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
        height:'25%',
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
    },
    headerRight:{
        flex:1,
        flexDirection:'row',
        width:155,
        alignItems:'center',
        justifyContent:'center'
    },
    headerButton:{
        height:50,
        width:50,
        alignItems:'center',
        justifyContent:'center'
    }
});

export default MerchantProfileScreen;