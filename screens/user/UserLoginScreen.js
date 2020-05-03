import React, {useCallback, useEffect, useReducer, useState} from 'react';
import { View, Text, StyleSheet, Button , Alert} from 'react-native';
import Input from '../../components/Input';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as userActions from '../../store/actions/user';

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

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

    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
          Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);

    const submitHandler = useCallback( async () => {
        if(!formState.formIsValid){
            console.log(formState);
            Alert.alert('Wrong Login!' , 'Please check your inputs', [{text: 'Okay'}]);
            return;
        }//if
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(userActions.getUser(
                formState.inputValues.email,
                formState.inputValues.password,
            ));
            
            props.navigation.replace({
                routeName:'Home',
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

            <View style={styles.buttonContainer}>
                <Button title='Login' color={Colors.backgrounddark} onPress={submitHandler}/>
                <Button title='Sign Up' color={Colors.backgrounddark} onPress={()=>props.navigation.navigate('UserSignUp')} />
            </View>
        </View>
    );
};
UserLoginScreen.navigationOptions = navData => {
    
    return {
        headerTitle:'User Login',
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
        //justifyContent:'center'
    },
    buttonContainer:{
        padding:10,
        marginTop:20,
        height:60,
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
    }
});

export default UserLoginScreen;