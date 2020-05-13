import React, {useCallback, useEffect, useReducer, useState} from 'react';
import { View, Text, StyleSheet, Button , Alert} from 'react-native';
import Dialog from 'react-native-dialog'
import LoginInput from '../../components/LoginInput';
import { useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as userActions from '../../store/actions/user';
import { Colors } from 'react-native-paper';

const INPUT_UPDATE = 'INPUT_UPDATE';
const RE_PASSWORD_UPDATE = 'RE_PASSWORD_UPDATE'

const formReducer = (state, action) =>{
    switch (action.type) {
        case INPUT_UPDATE:
            var updatedValues = action.values
            var updatedValidities = action.validities
            break
        case RE_PASSWORD_UPDATE:
            return {...state,
                rePassword:action.text
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
    return {...state,
        inputValues:updatedValues,
        inputValidities:updatedValidities,
        formIsValid:formIsValid
    }
};

const UserLoginScreen = props => {
    console.log('User Login')
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [promptVisability, setPromptVisability] = useState(false)
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues:{
            email:'',
            password:''
        },
        inputValidities:{
            email:false,
            password:false
        },
        formIsValid:false,
        rePassword:''
    });

    const submitHandler = useCallback( async () => {
        console.log('-Login Handler')
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
            
            props.navigation.navigate('Home');
        } catch(err){
            setError(err.message);
        }
        setIsLoading(false);
    
    }, [formState]);

    const signUpHandler = useCallback(async () => {
        console.log('-Sign Up Handler')
        setPromptVisability(false)
        if (!formState.formIsValid){
            Alert.alert(
                'Invalid Input!',
                'Please check your inputs...', 
                [{text: 'Okay'}]
            );
            return;
        }
        if(!(formState.inputValues.password === formState.rePassword)){
            Alert.alert(
                'Passwords do not match!',
                'Please check your passwords', 
                [{text: 'Okay'}]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(userActions.createUser(
                formState.inputValues.email,
                formState.inputValues.password,
            ));
            props.navigation.navigate('Home');
        }
        catch(err){
            setError(err.message);
        }
        setIsLoading(false);
    }, [formState]);

    const inputChangeHandler = useCallback((inputValues, inputValidities) => {
        console.log('-Input Change Handler');
        dispatchFormState({
            type: INPUT_UPDATE,
            values: inputValues,
            validities: inputValidities,
        })
    },[dispatchFormState]);

    useEffect(() => {
        if (error) {
          Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    return(
        <View style={styles.screen}>
            <LoginInput
                onInputChange={inputChangeHandler}
                onLogin={submitHandler}
                onSignUp={() => setPromptVisability(true)}
            />
            <Dialog.Container visible={promptVisability}>
                <Dialog.Title style={{fontWeight:'bold'}}>Confirmation Required!</Dialog.Title>
                <Dialog.Description>
                    Please re-enter your password to create an account...
                </Dialog.Description>
                <Dialog.Input 
                    style={{borderBottomWidth:1}}
                    onChangeText={(text) => {dispatchFormState({type:RE_PASSWORD_UPDATE, text:text})}}
                    autoCapitalize = "none"
                />
                <Dialog.Button label="Cancel" onPress={() => setPromptVisability(false)}/>
                <Dialog.Button label="Confirm" onPress={signUpHandler}/>
            </Dialog.Container>
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
        height:'100%'
    },
});

export default UserLoginScreen;
