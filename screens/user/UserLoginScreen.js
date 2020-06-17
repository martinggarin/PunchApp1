import React, {useCallback, useEffect, useReducer, useState} from 'react';
import { View, Text, StyleSheet, Image , Alert} from 'react-native';
import Dialog from 'react-native-dialog'
import LoginInput from '../../components/LoginInput';
import { useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as userActions from '../../store/actions/user';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

    const submitHandler = useCallback(async () => {
        console.log('-Login Handler')
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(userActions.getUser(
                formState.inputValues.email,
                formState.inputValues.password
            ));
            props.navigation.replace('Home');
            setIsNewUser(false)
        } catch(err){
            setError(err.message);
        }
        setIsLoading(false);
        setIsNewUser(true)
    
    }, [formState]);

    const signUpHandler = useCallback(async (useGoogle) => {
        console.log('-Sign Up Handler')
        if(!(formState.inputValues.password === formState.rePassword) && !useGoogle){
            Alert.alert(
                'Passwords do not match!',
                'Please check password inputs', 
                [{text: 'Okay'}]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try{
            let newUser = await dispatch(userActions.createUser(
                formState.inputValues.email,
                formState.inputValues.password,
                useGoogle
            ));
            if (newUser){
                props.navigation.replace('Explore');
            }else{
                props.navigation.replace('Home');
            }
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
            <View style={styles.inputContainer}>
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
            </View>
            {/* <View style={styles.googleContainer}>
                <TouchableOpacity onPress={() => signUpHandler(true)}>
                    <View style={styles.googleButton}>
                        <Image
                            style={styles.googleLogo}
                            source={{
                            uri: 'https://pluspng.com/img-png/google-logo-png-open-2000.png'
                        }}
                        />
                        <Text  font='Roboto'>SIGN IN WITH GOOGLE</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {isLoading && <ActivityIndicator color={Colors.darkLines} size='large'/>}
            <Dialog.Container visible={promptVisability}>
                <Dialog.Title style={{fontWeight:'bold'}}>Confirmation Required!</Dialog.Title>
                <Dialog.Description>
                    Please re-enter your password to create an account...
                </Dialog.Description>
                <Dialog.Input 
                    style={{borderBottomWidth: Platform.OS == 'android' ? 1: 0, color: Colors.borderDark}}
                    autoCorrect={false}
                    autoCompleteType='off'
                    onChangeText={(text) => {dispatchFormState({type:RE_PASSWORD_UPDATE, text:text})}}
                    autoCapitalize = "none"
                    secureTextEntry
                />
                <Dialog.Button label="Cancel" onPress={() => setPromptVisability(false)}/>
                <Dialog.Button label="Confirm" onPress={() => signUpHandler(false)}/>
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
        width:'100%',
        flex:1,
        flexDirection:'column'
    },
    inputContainer:{
        height:245,
    },
    googleContainer:{
        width:'100%', 
        alignItems:'center',
        marginBottom:10
    },
    googleButton:{
        flexDirection:'row',
        alignItems:'center',
        width:240,
        height:40,
        borderColor:Colors.borderDark,
        borderWidth:1,
        borderRadius:3,
    },
    googleLogo:{
        height:20,
        width:20,
        marginLeft:8,
        marginRight:24
    }
});

export default UserLoginScreen;
