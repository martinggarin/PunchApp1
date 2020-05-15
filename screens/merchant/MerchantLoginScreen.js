import React, {useCallback, useEffect, useReducer, useState} from 'react';
import { View, Text, StyleSheet, Button , Alert} from 'react-native';
import Dialog from 'react-native-dialog'
import LoginInput from '../../components/LoginInput';
import { useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as merchantActions from '../../store/actions/merchants';
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

const MerchantLoginScreen = props => {
    console.log('Merchant Login')
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isNewUser, setIsNewUser] = useState(true);
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
            setIsNewUser(false)
        } catch(err){
            setError(err.message);
        }
        setIsLoading(false)
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
            await dispatch(merchantActions.createMerchant(
                formState.inputValues.email,
                formState.inputValues.password,
            ));
            props.navigation.navigate('Edit',{newMerchant:true});
            setIsNewUser(false)
        }
        catch(err){
            setError(err.message);
        }
        setIsLoading(false);
        setIsNewUser(true);
        setPromptVisability(false);
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
            {isLoading && <ActivityIndicator color={Colors.darkLines} size='large' style={{marginTop:20}}/>}
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