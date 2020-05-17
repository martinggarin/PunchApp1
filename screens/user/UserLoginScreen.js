import React, {useCallback, useEffect, useReducer, useState} from 'react';
import { View, Text, StyleSheet, Button , Alert} from 'react-native';
import Dialog from 'react-native-dialog'
import LoginInput from '../../components/LoginInput';
import { useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as userActions from '../../store/actions/user';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '../../constants/Colors';

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
    const [isNewUser, setIsNewUser] = useState(true);
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

    const submitHandler = useCallback( async (useGoogle) => {
        console.log('-Login Handler')
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(userActions.getUser(
                formState.inputValues.email,
                formState.inputValues.password,
                useGoogle
            ));
            props.navigation.navigate('Home');
            setIsNewUser(false)
        } catch(err){
            setError(err.message);
        }
        setIsLoading(false);
        setIsNewUser(true)
    
    }, [formState]);

    const signUpHandler = useCallback(async () => {
        console.log('-Sign Up Handler')
        if(!(formState.inputValues.password === formState.rePassword)){
            Alert.alert(
                'Passwords do not match!',
                'Please check password inputs', 
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
            props.navigation.navigate('Explore');
        }
        catch(err){
            setError(err.message);
        }
        setIsLoading(false);
        setPromptVisability(false)
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
          Alert.alert('Problem signing in!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    return(
        <View style={styles.screen}>
            {isNewUser && <LoginInput
                onInputChange={inputChangeHandler}
                onLogin={() => {
                    if (formState.formIsValid){
                        submitHandler()
                    }else{
                        Alert.alert(
                            'Invalid Input!',
                            'Please check your inputs...', 
                            [{text: 'Okay'}]
                        );
                    }
                }}
                onSignUp={() => {
                    if (formState.formIsValid){
                        setPromptVisability(true)
                    }else{
                        Alert.alert(
                            'Invalid Input!',
                            'Please check your inputs...', 
                            [{text: 'Okay'}]
                        );
                    }
                }}
            />}
            <Button title={'Sign in with Google'} onPress={() => submitHandler({useGoogle:true})}/>
            <View style={{marginBottom:10}}>
                {isLoading && <ActivityIndicator color={Colors.darkLines} size='large'/>}
            </View>
            <Dialog.Container visible={promptVisability}>
                <Dialog.Title style={{fontWeight:'bold'}}>Confirmation Required!</Dialog.Title>
                <Dialog.Description>
                    Please re-enter your password to create an account...
                </Dialog.Description>
                <Dialog.Input 
                    style={{borderBottomWidth:1}}
                    secureTextEntry
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
        flexDirection:'column',
        alignItems:'center',
        height:'100%'
    }
});

export default UserLoginScreen;
