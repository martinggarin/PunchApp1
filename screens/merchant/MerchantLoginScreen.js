import React, {useCallback, useEffect, useReducer, useState} from 'react';
import { View, Text, StyleSheet, Button , Alert} from 'react-native';
import Dialog from 'react-native-dialog'
import LoginInput from '../../components/LoginInput';
import { useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as merchantActions from '../../store/actions/merchants';
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

const MerchantLoginScreen = props => {
    console.log('Merchant Login')
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [promptVisability, setPromptVisability] = useState(false)
    //const merchants = useSelector(state => state.merchants.availableMerchants);
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

    const submitHandler = useCallback(async ()  => {
        console.log('-Login Handler')
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(merchantActions.getMerchant(
                formState.inputValues.email,
                formState.inputValues.password
            ));
            props.navigation.navigate('MerchantHome');
        } catch(err){
            setError(err.message);
        }
        setIsLoading(false);

    }, [formState]);

    const signUpHandler = useCallback(async () => {
        console.log('-Sign Up Handler')
        setPromptVisability(false)
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
            await dispatch(merchantActions.createMerchant(
                formState.inputValues.email,
                formState.inputValues.password,
            ));
            props.navigation.navigate('Edit',{newMerchant:true});
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
                onLogin={() => {
                    if (formState.formIsValid){
                        submitHandler()
                    }else{
                        Alert.alert(
                            'Invalid Input!',
                            'Please check that your inputs...', 
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
                            'Please check that your inputs...', 
                            [{text: 'Okay'}]
                    );
                }
                }}
            />
            <Dialog.Container visible={promptVisability}>
                <Dialog.Title style={{fontWeight:'bold'}}>Confirmation Required!</Dialog.Title>
                <Dialog.Description>
                    Please re-enter your password to create a merchant account...
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
MerchantLoginScreen.navigationOptions = navData => {
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
        height:'100%'
    },
});

export default MerchantLoginScreen;