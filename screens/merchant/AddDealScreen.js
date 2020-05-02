import React, {useCallback, useReducer} from 'react';
import { View, Text, StyleSheet, Flatlist, Alert, Button } from 'react-native';
import {useDispatch} from 'react-redux';
import Input from '../../components/Input';
import * as MerchantActions from '../../store/actions/merchants';
import Deal from '../../models/Deal';
const FORM_INPUT_UPDATE = 'UPDATE';

const formReducer = (state, action) =>{
    switch(action.type){
        case FORM_INPUT_UPDATE:
            const updatedValues = {
                ...state.inputValues,
                [action.inputId]:action.value
            };//uval
            const updatedValidity = {
                ...state.inputValidities,
                [action.inputId]:action.isValid
            }//uvalid
            let totalValidity = true;
            for (const key in updatedValidity){
                totalValidity = totalValidity && updatedValidity[key];
            };//for
            const updatedState = {
                inputValues: updatedValues,
                inputValidities: updatedValidity,
                formIsValid: totalValidity
            }
            return updatedState;

        default:
            return state;
    }
  };


const AddDealScreen = props => {
    const r_id = props.navigation.getParam('id');
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues:{
            reward:'',
            ammount:''
        },
        inputValidities:{
            reward:false,
            ammount:false
        },
        formIsValid:false
    });

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        console.log('inputChangeHandler');
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            inputId: inputIdentifier
        })
      },[dispatchFormState]);

      const submit = useCallback(()=> {
        if(!formState.isValid){
            Alert.alert('Wrong Login!' , 'Please check your inputs', [{text: 'Okay'}]);
        };
        try{
        dispatch(MerchantActions.editDeal(
            r_id,
            formState.inputValues.ammount,
            formState.inputValues.reward
        ));
        }catch(err){
            console.log(err.message);
        }
        props.navigation.navigate('MerchantHome');
      },[formState]);

    return(
        <View style={styles.screen}>
            <Text>
                This is the ADD deal Screen
            </Text>

            <Input 
                id='Reward'
                label='Enter the Reward'
                errorText='please enter a valid reward'
                keyboardType='default'
                returnKeyType='next'
                autoCorrect
                autoCapitalize='none'
                initialValue=''
                initiallyValid={false}
                onInputChange={inputChangeHandler}
                required
            />
            <Input 
                id='Ammount'
                label='Enter Ammount Needed for the Reward'
                errorText='please enter a valid ammount'
                keyboardType='decimal-pad'
                returnKeyType='next'
                autoCorrect
                autoCapitalize='none'
                initialValue=''
                initiallyValid={false}
                onInputChange={inputChangeHandler}
                required
            />
            <Button title='Submit' onPress={submit} />

        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
    }
});

export default AddDealScreen;