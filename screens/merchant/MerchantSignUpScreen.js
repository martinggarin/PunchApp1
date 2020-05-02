import React, {useCallback, useEffect, useReducer, useState} from 'react';
import { View, Text, StyleSheet, Button , Alert} from 'react-native';
import Input from '../../components/Input';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as merchantActions from '../../store/actions/merchants';

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

const MerchantSignUpScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues:{
            email:'',
            password:'',
            rePassword:'',
            title:''
        },
        inputValidities:{
            email:false,
            password:false,
            rePassword:false,
            title:false,
        },
        formIsValid:false
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
          Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);

    const submitHandler = useCallback( async () => {
        if(!formState.formIsValid ){
            console.log(formState);
            Alert.alert('Wrong Login!' , 'Please check your inputs', [{text: 'Okay'}]);
            return;
        }//if
        if(!(formState.inputValues.password === formState.inputValues.rePassword)){
            Alert.alert('Passwords must match!' , 'Please check your passwords', [{text: 'Okay'}]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(merchantActions.createMerchant(
                formState.inputValues.email,
                formState.inputValues.password,
                formState.inputValues.title
            ));
            
            props.navigation.replace({
                routeName:'MerchantHome',
                params:{
                    email:formState.inputValues.email
                }
            });
        } catch(err){
            setError(err.message);
        }
        setIsLoading(false);
    
    }, [formState, formState]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
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
                This is the Merchant Login Screen
            </Text>
            <Input 
                id='email'
                label='email'
                errorText='please enter a valid email'
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
                id='password'
                label='password'
                errorText='please enter a valid password'
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect
                initialValue=''
                initiallyValid={false}
                onInputChange={inputChangeHandler}
                required
            />
            <Input 
                id='rePassword'
                label='re-password'
                errorText='please enter a valid password'
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect
                initialValue=''
                initiallyValid={false}
                onInputChange={inputChangeHandler}
                required
            />
            <Input 
                id='title'
                label='Merchant Name'
                errorText='please enter a valid name'
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect
                initialValue=''
                initiallyValid={false}
                onInputChange={inputChangeHandler}
                required
            />

            <View style={styles.buttonContainer}>
                <Button title='signup' color={Colors.backgrounddark} onPress={submitHandler}/>
            </View>
        </View>
    );
};
MerchantSignUpScreen.navigationOptions = navData => {
    
    return {
        headerTitle:'Merchant Login',
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
        padding:10,
    },
    buttonContainer:{
        padding:10,
        marginTop:20,
        height:100
    }
});

export default MerchantSignUpScreen;