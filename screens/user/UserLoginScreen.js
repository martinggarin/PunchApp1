import React, {useCallback, useEffect, useReducer} from 'react';
import { View, Text, StyleSheet, Button , Alert} from 'react-native';
import Input from '../../components/Input';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';

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

const UserLoginScreen = props => {

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues:{
            email:'',
            password:''
        },
        inputValidities:{
            email:false,
            password:false
        },
        formIsValid:false
    });

    const submitHandler = useCallback(() => {
        if(!formState.formIsValid){
            Alert.alert('Wrong Login!' , 'Please check your inputs', [{text: 'Okay'}]);
            return;
        }//if
    }, [formState]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        console.log('inputChangeHandler');
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            inputId: inputIdentifier
        })
      },[dispatchFormState]);

    return(
        <View style={styles.screen}>
            <Text>
                This is the User Login Screen
            </Text>
            <Input 
                id='email'
                label='email'
                errorText='please enter a valid email'
                keyboardType='default'
                returnKeyType='next'
                autoCorrect
                initialValue=''
                initiallyValid={false}
                onInputChange={inputChangeHandler}
                required
            />
            <Input 
                id='password'
                label='password'
                errorText='please enter a valid password'
                keyboardType='default'
                returnKeyType='next'
                autoCorrect
                initialValue=''
                initiallyValid={false}
                onInputChange={inputChangeHandler}
                required
            />

            <View style={styles.buttonContainer}>
                <Button title='login' color={Colors.backgrounddark} onPress={submitHandler}/>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        padding:10,
    },
    buttonContainer:{
        padding:10,
        marginTop:20,
        height:100
    }
});

export default UserLoginScreen;