import React, {useCallback, useReducer, useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { useBackHandler } from '@react-native-community/hooks'
import {useDispatch, useSelector} from 'react-redux';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog'
import ProfileInput from '../../components/ProfileInput';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';
import { setLightEstimationEnabled } from 'expo/build/AR';

const INPUT_UPDATE = 'UPDATE';
const PASSWORD_UPDATE = 'PASSWORD_UPDATE';

const formReducer = (state, action) =>{
    switch (action.type) {
        case INPUT_UPDATE:
            var updatedValues = action.values
            var updatedValidities = action.validities
            break
        case PASSWORD_UPDATE:
            return{...state,
                adminPassword:action.newValue
            }
        default:
            return state;
    }
    var formIsValid = true
    for (const key in updatedValidities){
        if (updatedValidities[key] === false){
            formIsValid = false
        }
    }
    //console.log(formIsValid)
    return {...state,
        inputValues:updatedValues,
        inputValidities:updatedValidities,
        formIsValid:formIsValid
    }
};

const EditScreen = props => {
    console.log('Edit');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [displayHelp, setDisplayHelp] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [promptVisibility, setPromptVisibility] = useState(false)
    const r_item = useSelector(state => state.merchants.myMerchant);
    const newMerchant = props.navigation.getParam('newMerchant');
    const [passwordInput, setPasswordInput] = useState(null)
    const [rePasswordInput, setRePasswordInput] = useState(null)
    
    const dispatch = useDispatch();

    let deals = useSelector(state => state.merchants.myDeals);
    if (deals === undefined || deals === null){
        var totalDeals = 0
        deals = []
    }
    else{
        var totalDeals = deals.length
    }

    const initialValues = {
        inputValues:{
            title: r_item.title,
            price: r_item.price,
            type: r_item.type,
            address: r_item.address,
            city: r_item.city
        },
        inputValidities:{
            title: true,
            price: true,
            type: true,
            address: true,
            city: true
        },
        formIsValid:true,
        adminPassword: r_item.adminPassword
    }
    if (newMerchant && displayHelp){
        initialValues.inputValues.price = "$"
        initialValues.inputValidities = {
            title: false,
            price: true,
            type: false,
            address: false,
            city: false
        }
        initialValues.formIsValid = false
        initialValues.adminPassword = null
        Alert.alert(
            'Welcome to PunchApp!',
            'Your merchant account has been successfully created!\n\n'
            +'When you complete your profile, use the button in the top right corner to save your information.\n\n'
            +'You will then be prompted to enter an administrator password for managing your account.',
            [{text: 'Okay'}]
        )
        setDisplayHelp(false)
    }

    //different initial values depending on entry
    const [formState, dispatchFormState] = useReducer(formReducer, initialValues);
    const submitHandler = useCallback( async () => {
        console.log('-Submit Profile Handler')
        if (!formState.formIsValid){
            Alert.alert(
                'Invalid Input!',
                'Please check your inputs...', 
                [{text: 'Okay'}]
            );
            return;
        };
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(MerchantActions.updateMerchant(
                r_item.id,
                formState.inputValues.title,
                formState.inputValues.price,
                formState.inputValues.type,
                formState.inputValues.address,
                formState.inputValues.city,
                formState.adminPassword,
            ));
            if (newMerchant){
                props.navigation.navigate('MerchantHome')
            }
            else{
                props.navigation.goBack();
            }
            
        }catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    },[formState, dispatch]);

    const inputChangeHandler = useCallback((inputValues, inputValidities) => {
        console.log('-Input Change Handler');
        dispatchFormState({
            type: INPUT_UPDATE,
            values: inputValues,
            validities: inputValidities,
        })
    },[dispatchFormState]);

    const dealTapHandler = useCallback((dealCode) => {
        Alert.alert(
            deals[dealCode].reward+" Deal Selected",
            "What would you like to do with it?",
            [{   
                text: "Edit", 
                onPress: () => {
                    console.log('-Deal Edit Handler')
                    props.navigation.navigate('UpdateDeal', {id:r_item.id, deals:deals, dealCode:dealCode})
                }
            },{ 
                text: "Remove",
                onPress:  () => {
                    console.log('-Deal Remove Handler')
                    dispatch(MerchantActions.removeDeal(r_item.id, dealCode))
                }
            }],
            { cancelable: true }
        ); 
    })

    useBackHandler(() => {
        if (newMerchant) {
          return true
        }
        return false
    })

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    useEffect(() => {
        if(newMerchant && !(formState.adminPassword === null) && !submitted){
            submitHandler()
            setSubmitted(true)
        }
    })
    useEffect(()=>{
        if (newMerchant){
            var handlerToUse = () => setPromptVisibility(true)
        }else{
            var handlerToUse = submitHandler
        }
        props.navigation.setParams({
            submit:handlerToUse,
            setPromptVisibility: () => setPromptVisibility(true)
        });
    }, [submitHandler]);

    const footer = (
        <TouchableOpacity
            onPress={()=> {
                console.log('-Deal Add Handler')
                props.navigation.navigate('UpdateDeal', {id:r_item.id, deals:deals, dealCode:totalDeals})
            }}
            style={styles.addContainer}
        >
            <View style={styles.addContainer}>
                <Ionicons name={'md-add-circle'} size={30} color={Colors.fontDark} />
                <Text>Add Deal</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.screen}>
            <View style={styles.upperContainer}>
                <ProfileInput
                    values={formState.inputValues}
                    validities={formState.inputValidities}
                    onInputChange={inputChangeHandler}
                />
            </View>
            <View style={styles.lowerContainer}>
                <DealList
                    dealData={deals}
                    onTap={dealTapHandler}
                    footer={footer}
                    merchantSide={true}
                />
            </View>
            <Dialog.Container visible={promptVisibility}>
                <Dialog.Title style={{fontWeight:'bold'}}>Reset Admin Password!</Dialog.Title>
                <Dialog.Description>
                    Please enter a unique password to use for administrator access...
                </Dialog.Description>
                <Dialog.Input 
                    style={{borderBottomWidth: Platform.OS == 'android' ? 1: 0}}
                    autoCorrect={false}
                    autoCompleteType='off'
                    placeholder="Enter Your Password"
                    onChangeText={(text) => {
                        console.log("-Input Change Handler")
                        setPasswordInput(text)
                    }}
                    autoCapitalize = "none"
                    secureTextEntry
                />
                <Dialog.Input 
                    style={{borderBottomWidth: Platform.OS == 'android' ? 1: 0}}
                    autoCorrect={false}
                    autoCompleteType='off'
                    placeholder="Re-enter Your Password"
                    onChangeText={(text) => {
                        console.log("-Input Change Handler")
                        setRePasswordInput(text)
                    }}
                    autoCapitalize = "none"
                    secureTextEntry
                />
                <Dialog.Button label="Cancel" onPress={() => {
                    setPasswordInput(r_item.adminPassword)
                    setPromptVisibility(false)
                }}/>
                <Dialog.Button label="Confirm" onPress={async () => {
                    if(passwordInput.length < 5){
                        Alert.alert(
                            'Invalid Input!',
                            'Admin password must be at least 5 characters', 
                            [{text: 'Okay'}]
                        );
                    }else if(passwordInput === rePasswordInput){
                        console.log("-Password Change Handler")
                        await dispatchFormState({
                            type: PASSWORD_UPDATE,
                            newValue: passwordInput
                        })
                        setPromptVisibility(false)
                    }else{
                        Alert.alert(
                            'Passwords do not match!',
                            'Please check password inputs', 
                            [{text: 'Okay'}]
                        );
                    };
                }}/>
            </Dialog.Container>
        </View>
    );
};

EditScreen.navigationOptions = navigationData => {
    const submit = navigationData.navigation.getParam('submit');
    const setPromptVisibility = navigationData.navigation.getParam('setPromptVisibility')
    return{
        title:'Edit Profile',
        headerRight: () => {
            return (
                <View style={styles.headerRight}>
                    <View style={styles.headerButton}>
                        <MaterialIcons 
                            name='supervisor-account'
                            size={30}
                            color={Colors.lines}
                            style={{marginRight:10}}
                            onPress={setPromptVisibility}
                        />
                    </View>
                    <View style={styles.headerButton}>
                        <Feather 
                            name='save'
                            size={25}
                            color={Colors.lines}
                            style={{marginRight:10}}
                            onPress={submit}
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
        alignItems:'center'
    },
    upperContainer:{
        width:'95%',
        height:190,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.primary,
        borderRadius:3,
        margin:'2.5%'
    },
    lowerContainer:{
        height:'60%',
        justifyContent:'center'
    },
    addContainer:{
        alignItems:'center',
        height:150, 
        margin:10,
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

export default EditScreen;