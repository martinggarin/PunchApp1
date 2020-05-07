import React, {useCallback, useReducer, useEffect, useState} from 'react';
import { View, Text, StyleSheet, Flatlist, Alert, Button } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { Feather } from '@expo/vector-icons';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import ProfileInput from '../../components/ProfileInput';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';
const FORM_INPUT_UPDATE = 'UPDATE';

const formReducer = (state, action) =>{
    switch (action.type) {
        case FORM_INPUT_UPDATE:
            const updatedState = {
                merchantID: action.id,
                inputValues: action.values,
                inputValidity: action.isValid
            }
            return updatedState;
        default:
            return state;
    }
};


const EditScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const r_item = useSelector(state => state.merchants.myMerchant);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        merchantID: r_item.id,
        inputValues:{
            title: r_item.title,
            price: r_item.price,
            type: r_item.type,
            address: r_item.address,
            city:r_item.city
        },
        inputValidity:true
    });

    const inputChangeHandler = useCallback((merchantID, inputValues, inputValidity) => {
        console.log('Input Change Handler');
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            id: merchantID,
            values: inputValues, 
            isValid: inputValidity,
        })
    },[dispatchFormState]);

    const submitHandler = useCallback( async () => {
        console.log('Submit Handler')
        console.log(formState)
        if (!formState.inputValidity){
            Alert.alert('Wrong Inputs!' , 'Please check your inputs', [{text: 'Okay'}]);
            return;
        };
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(MerchantActions.editProfile(
                formState.merchantID,
                formState.inputValues.title,
                formState.inputValues.price,
                formState.inputValues.type,
                formState.inputValues.address,
                formState.inputValues.city
            ));
            props.navigation.goBack();
        }catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    },[formState, dispatch]);
    
    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    useEffect(()=>{
        props.navigation.setParams({submit:submitHandler});
    }, [submitHandler]);

    return (
        <View style={styles.screen}>
            <View style={{width:'95%', height:190, alignItems:'center', justifyContent:'center', backgroundColor:Colors.backgrounddark, borderRadius:3, marginTop:'2.5%'}}>
                <ProfileInput
                    merchant={r_item}
                    onInputChange={inputChangeHandler}
                />
            </View>
        </View>
    );
};

EditScreen.navigationOptions = navigationData => {
    const submit = navigationData.navigation.getParam('submit');
    return{
        title:'Edit Profile',
        headerRight: () => {
            return (
                <Feather 
                    name='save'
                    size={25}
                    color={Colors.lightLines}
                    style={{marginRight:10}}
                    onPress={submit}
                />
            )
        }
    }
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center'
    }
});

export default EditScreen;