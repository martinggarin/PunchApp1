import React, {useCallback, useEffect, useState} from 'react';
import { Alert, View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Dialog from 'react-native-dialog'
import { Feather, Ionicons, AntDesign} from '@expo/vector-icons';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';

const MerchantHomeScreen = props => {
    console.log('Merchant Home');
    const r_item = useSelector(state => state.merchants.myMerchant);
    //console.log(r_item)
    let deals = useSelector(state => state.merchants.myDeals);
    const [editPromptVisibility, setEditPromptVisibility] = useState(false)
    const [employeePromptVisibility, setEmployeePromptVisibility] = useState(false)
    const [adminPasswordInput, setAdminPasswordInput] = useState('')
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
            deals[dealCode].reward,
            deals[dealCode].amount+" point(s) will be deducted from the customer's loyalty point balance",
            [
                { 
                    text: "Cancel",
                    onPress: () => {console.log('-Cancel Pressed')}, 
                    style:'cancel'
                },
                { 
                    text: "Confirm",
                    onPress:  () => {
                        console.log('-Scan Handler')
                        props.navigation.navigate('Scan', {reward:deals[dealCode].reward, amount:deals[dealCode].amount})
                    }
                }
            ],
            { cancelable: true }
        ); 
    })

    useEffect(()=>{
        props.navigation.setParams({
            deals:totalDeals,
            adminPasswordExists:!(r_item.adminPassword === undefined),
            navigateToEdit:() => props.navigation.navigate('Edit', {newMerchant:true}),
            navigateToEmployee:() => props.navigation.navigate('Employee'),
            setEditPromptVisibility:setEditPromptVisibility,
            setEmployeePromptVisibility:setEmployeePromptVisibility
        });
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
                    merchantSide={true}
                />
            </View>
            <Dialog.Container visible={editPromptVisibility}>
                <Dialog.Title style={{fontWeight:'bold'}}>Verification Required!</Dialog.Title>
                <Dialog.Description>
                    Please enter your administrator password to access the edit screen...
                </Dialog.Description>
                <Dialog.Input 
                    style={{borderBottomWidth: Platform.OS == 'android' ? 1: 0, color: Colors.borderDark}}
                    autoCorrect={false}
                    autoCompleteType='off'
                    onChangeText={(text) => {
                        console.log("-Input Change Handler")
                        setAdminPasswordInput(text)
                    }}
                    autoCapitalize = "none"
                    secureTextEntry
                />
                <Dialog.Button label="Cancel" onPress={() => {
                    setAdminPasswordInput('')
                    setEditPromptVisibility(false)
                }}/>
                <Dialog.Button label="Confirm" onPress={() => {
                    if(adminPasswordInput === r_item.adminPassword){
                        props.navigation.navigate('Edit', {newMerchant:false})
                        setAdminPasswordInput('')
                        setEditPromptVisibility(false)
                    }else{
                        Alert.alert(
                            'Wrong Password!',
                            'Please try again...', 
                            [{text: 'Okay'}]
                        );
                    };
                }}/>
            </Dialog.Container>
            <Dialog.Container visible={employeePromptVisibility}>
                <Dialog.Title style={{fontWeight:'bold'}}>Verification Required!</Dialog.Title>
                <Dialog.Description>
                    Please enter your administrator password to access the employee screen...
                </Dialog.Description>
                <Dialog.Input 
                    style={{borderBottomWidth: Platform.OS == 'android' ? 1: 0, color: Colors.borderDark}}
                    autoCorrect={false}
                    autoCompleteType='off'
                    onChangeText={(text) => {
                        console.log("-Input Change Handler")
                        setAdminPasswordInput(text)
                    }}
                    autoCapitalize = "none"
                    secureTextEntry
                />
                <Dialog.Button label="Cancel" onPress={() => {
                    setAdminPasswordInput('')
                    setEmployeePromptVisibility(false)
                }}/>
                <Dialog.Button label="Confirm" onPress={() => {
                    if(adminPasswordInput === r_item.adminPassword){
                        props.navigation.navigate('Employee')
                        setAdminPasswordInput('')
                        setEmployeePromptVisibility(false)
                    }else{
                        Alert.alert(
                            'Wrong Password!',
                            'Please try again...', 
                            [{text: 'Okay'}]
                        );
                    };
                }}/>
            </Dialog.Container>
        </View>
    );
};

MerchantHomeScreen.navigationOptions = navigationData => {
    const deals = navigationData.navigation.getParam('deals');
    const adminPasswordExists = navigationData.navigation.getParam('adminPasswordExists');
    const navigateToEdit = navigationData.navigation.getParam('navigateToEdit');
    const setEditPromptVisibility = navigationData.navigation.getParam('setEditPromptVisibility');
    const setEmployeePromptVisibility = navigationData.navigation.getParam('setEmployeePromptVisibility');
    if (deals > 0){
        var published = true
        var iconName = 'checkcircle'
    }else{
        var published = false
        var iconName = 'checkcircleo'
    }
    return{
        headerLeft: () => {
            return (
                <View style={styles.headerLeft}>
                    <View style={styles.headerButton}>
                        <AntDesign
                            name='questioncircleo'
                            size={25}
                            color={Colors.lightLines}
                            onPress={()=>{
                                Alert.alert(
                                    'Merchant Help',
                                    'Thank you for using PunchApp! We hope you are enjoying your experience.\n\n'
                                    +'• Profile information, employee information, and deals can only be updated from the edit screen using an administrator password\n\n'
                                    +'• Maintain at least one deal to ensure your profile remains public\n\n'
                                    +'• To edit or remove a deal, select it on the edit screen\n\n'
                                    +'• To credit loyalty points to a customer account, scan their reward code using the scanning tab\n\n'
                                    +'• To redeem a deal for a customer, select it on the home screen and scan their reward code\n\n'
                                    +'• The audit tab can be used check employee validated transaction histories once authenticated using an administrator password',
                                    [{text: 'Okay'}]
                                )
                            }}
                        />
                    </View>
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
                </View>
            )
        },
        headerRight: () => {
            return (
                <View style={styles.headerRight}>
                    <View style={styles.headerButton}>
                        <Ionicons 
                            name='ios-people'
                            size={25}
                            color={Colors.lightLines}
                            onPress={()=>{
                                console.log('-Employee Handler')
                                if (adminPasswordExists){
                                    setEmployeePromptVisibility(true)
                                }else{
                                    navigateToEdit()
                                }
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
                                if (adminPasswordExists){
                                    setEditPromptVisibility(true)
                                }else{
                                    navigateToEdit()
                                }
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
        flex:1,
        width:'95%',
        backgroundColor:Colors.primary,
        borderRadius:3,
        margin:'2.5%'
    },
    lowerContainer:{
        height:'77.5%',
        justifyContent:'center',
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
    headerLeft:{
        flex:1,
        flexDirection:'row',
        width:100,
        alignItems:'center',
        justifyContent:'center'
    },
    headerRight:{
        flex:1,
        flexDirection:'row',
        width:100,
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

export default MerchantHomeScreen;