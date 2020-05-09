import React, {useCallback, useReducer, useEffect, useState} from 'react';
import { View, Text, StyleSheet, Flatlist, Alert, Button } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { Feather } from '@expo/vector-icons';
import ProfileInput from '../../components/ProfileInput';
import DealInputList from '../../components/DealInputList';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';
const INPUT_UPDATE = 'UPDATE';
const DEAL_INPUT_UPDATE = 'DEAL_UPDATE';

const formReducer = (state, action) =>{
    const updatedState = state
    switch (action.type) {
        case INPUT_UPDATE:
            updatedState.inputValues = action.values
            break
        case DEAL_INPUT_UPDATE:
            updatedState.dealInputValues = action.deal
            break
        default:
            return state;
    }
    updatedState.inputValidity = action.isValid
    return updatedState
};


const EditScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const r_item = useSelector(state => state.merchants.myMerchant);
    console.log('Edit Screen')
    console.log(r_item)
    const deal = useSelector(state => state.merchants.myDeals);
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
        dealInputValues:deal,
        inputValidity:true
    });

    const inputChangeHandler = useCallback((inputValues, inputValidity) => {
        console.log('Input Change Handler');
        dispatchFormState({
            type: INPUT_UPDATE,
            values: inputValues,
            isValid: inputValidity,
        })
    },[dispatchFormState]);

    const dealInputChangeHandler = useCallback((dealInputValues, inputValidity) => {
        console.log('Deal Input Change Handler');
        dispatchFormState({
            type: DEAL_INPUT_UPDATE,
            deal: dealInputValues,
            isValid: inputValidity,
        })
    },[dispatchFormState]);

    const dealRemoveHandler = useCallback( async (code) => {
        console.log('Deal Remove Handler');
        console.log(code);
        await Alert.alert(
            "Confirmation Required",
            "Are you sure you want to remove this deal?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Confirm", onPress: () => dispatch(MerchantActions.removeDeal(formState.merchantID, code)) }
            ],
            { cancelable: false }
        );
        props.navigation.goBack();
        props.navigation.navigate('Edit'); 
    },[dispatchFormState]);

    const dealAddHandler = useCallback( async () => {
        console.log('Deal Add Handler');
        try{
            dispatch(MerchantActions.addDeal(formState.merchantID))
        }catch(err) {
            setError(err.message)
        }
        props.navigation.goBack();
        props.navigation.navigate('Edit');
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
            await dispatch(MerchantActions.updateMerchant(
                formState.merchantID,
                formState.inputValues.title,
                formState.inputValues.price,
                formState.inputValues.type,
                formState.inputValues.address,
                formState.inputValues.city,
                formState.dealInputValues
            ));
            props.navigation.goBack();
        }catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
        props.navigation.goBack()
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
            <View style={{alignItems:'center', justifyContent:'center'}}>
                <DealInputList
                    merchantID={r_item.id}
                    dealData={deal}
                    onInputChange={dealInputChangeHandler}
                    onRemove={dealRemoveHandler}
                    onAdd={dealAddHandler}
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