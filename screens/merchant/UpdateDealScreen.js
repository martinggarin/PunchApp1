import React, {useCallback, useReducer, useEffect, useState, useSelector} from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Button } from 'react-native';
import {useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';
import Deal from '../../models/Deal';

const REWARD_INPUT_CHANGE = 'REWARD_INPUT_CHANGE';
const AMOUNT_INPUT_CHANGE = 'AMOUNT_INPUT_CHANGE';

const formReducer = (state, action) =>{
    const updatedValues = state.inputValues
    const updatedValidities = state.inputValidities
    switch(action.type){
        case REWARD_INPUT_CHANGE:
            updatedValues.reward = action.newValue
            updatedValidities.reward = action.isValid
            break
        case AMOUNT_INPUT_CHANGE:
            updatedValues.amount = action.newValue
            updatedValidities.amount = action.isValid
            break
        default:
            return {state}
    }
    var formIsValid = true
    for (const key in updatedValidities){
        if (updatedValidities[key] === false){
            formIsValid = false
        }
    }
    return {...state,
        inputValues:updatedValues,
        inputValidities:updatedValidities,
        formIsValid:formIsValid
    }
};


const UpdateDealScreen = props => {
    console.log('Update Deal');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const r_id = props.navigation.getParam('id');
    const deals = props.navigation.getParam('deals');
    const dealCode = props.navigation.getParam('dealCode')
    const dispatch = useDispatch();
    if (deals === undefined){
        totalDeals = 0
    }
    else{
        totalDeals = deals.length
    }

    if (totalDeals === dealCode){
        var initialValues = {
            inputValues:{
                reward: '',
                amount: '',
                code: dealCode
            },
            inputValidities:{
                reward:false,
                amount:false
            },
            formIsValid:false
        }        
        
    }
    else{
        var initialValues = {
            inputValues:{
                reward: deals[dealCode].reward,
                amount: deals[dealCode].amount,
                code: dealCode
            },
            inputValidities:{
                reward:true,
                amount:true
            },
            formIsValid:true
        }
    }

    const [formState, dispatchFormState] = useReducer(formReducer, initialValues);
    
    const handleReward = useCallback((text) => {
        console.log('-Input Change Handler')
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatchFormState({
            type: REWARD_INPUT_CHANGE, 
            newValue: text, 
            isValid: isValid,
        })
    },[dispatchFormState]);

    const handleAMOUNT = useCallback((text) => {
        console.log('-Input Change Handler')
        var isValid = true
        if ((text.length === 0) || (text.length > 10) || isNaN(text)){
            isValid = false
        }
        dispatchFormState({
            type: AMOUNT_INPUT_CHANGE, 
            newValue: text, 
            isValid: isValid,
        })
    },[dispatchFormState]);

    const handleSubmit = useCallback( async () => {
        console.log('-Submit Deal Handler')
        if(!formState.formIsValid){
            Alert.alert('Invalid Inputs!' , 
                        'Please check your inputs...\n\n'
                        +'Deal Names must be at least 1 character\n\n'
                        +'Deal Costs must be numeric and are limited to 10 digits', 
                        [{text: 'Okay'}]);
            return;
        };
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(MerchantActions.updateDeal(
            r_id,
            formState.inputValues.amount,
            formState.inputValues.reward,
            formState.inputValues.code
        ));
        props.navigation.goBack();
        }catch(err){
            setError(err.message);
        }
        setIsLoading(false);

    },[formState, dispatch, r_id]);
    
    useEffect(() => {
            if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
            }
        }, [error]);


    return(
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Ender a Name for this Deal</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Deal"
                            placeholderTextColor = {Colors.placeholderText}
                            defaultValue = {initialValues.inputValues.reward}
                            autoCapitalize = "none"
                            onChangeText = {handleReward}
                        />
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Enter a Point Cost for this Deal</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            keyboardType='decimal-pad'
                            underlineColorAndroid = "transparent"
                            placeholder = "Cost"
                            placeholderTextColor = {Colors.placeholderText}
                            defaultValue = {initialValues.inputValues.amount}
                            autoCapitalize = "none"
                            onChangeText = {handleAMOUNT}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.button}>
                <Button title='Submit' color={Colors.primary} onPress={handleSubmit} />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center'
    },
    container:{
        width:'95%',
        height:150,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.primary,
        borderRadius:3,
        margin:'2.5%'
    },
    rowContainer: {
        height:'45%',
        width:'95%',
        justifyContent: 'center',
        //borderColor: Colors.borderDark,
        //borderWidth: 1,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
    },
    inputView:{
        marginBottom: Platform.OS == 'ios' ? 5 : 0 ,
        marginLeft:2,
        marginRight:2,
        borderColor: Colors.borderDark,
        borderBottomWidth: 1,
        height:"65%",
        justifyContent:'center'
    },
    input: {
        color:Colors.input,
        marginLeft: 5,
    },  
    button: {
        width:'50%',
        justifyContent:'center'
    } 
});

export default UpdateDealScreen;