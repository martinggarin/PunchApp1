import React, {useCallback, useReducer, useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { Feather, Ionicons } from '@expo/vector-icons';
import ProfileInput from '../../components/ProfileInput';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';
import { setLightEstimationEnabled } from 'expo/build/AR';
const INPUT_UPDATE = 'UPDATE';


const formReducer = (state, action) =>{
    switch (action.type) {
        case INPUT_UPDATE:
            var updatedValues = action.values
            var updatedValidities = action.validities
            break
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


const EditScreen = props => {
    console.log('Edit Screen');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const r_item = useSelector(state => state.merchants.myMerchant);
    const deals = useSelector(state => state.merchants.myDeals);
    const dispatch = useDispatch();
    if (deals === undefined){
        totalDeals = 0
    }
    else{
        totalDeals = deals.length
    }

    initialValues = {
        inputValues:{
            title: r_item.title,
            price: r_item.price,
            type: r_item.type,
            address: r_item.address,
            city: r_item.city
        },
        inputValidities:{
            title: true,
            price: true,
            type: true,
            address: true,
            city: true
        },
        formIsValid:true
    }
    //different initial values depending on entry
    const [formState, dispatchFormState] = useReducer(formReducer, initialValues);

    const submitHandler = useCallback( async () => {
        console.log('-Submit Profile Handler')
        if (!formState.formIsValid){
            Alert.alert(
                'Invalid Input!',
                'Please check that your inputs...', 
                [{text: 'Okay'}]);
            return;
        };
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(MerchantActions.updateMerchant(
                r_item.id,
                formState.inputValues.title,
                formState.inputValues.price,
                formState.inputValues.type,
                formState.inputValues.address,
                formState.inputValues.city,
            ));
            props.navigation.goBack();
        }catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    },[formState, dispatch]);

    const inputChangeHandler = useCallback((inputValues, inputValidities) => {
        console.log('-Input Change Handler');
        dispatchFormState({
            type: INPUT_UPDATE,
            values: inputValues,
            validities: inputValidities,
        })
    },[dispatchFormState]);
    
    const dealTapHandler = useCallback((dealCode) => {
        Alert.alert(
            deals[dealCode].reward+" Deal Selected",
            "What would you like to do with it?",
            [
                {   
                    text: "Edit", 
                    onPress: () => {
                        console.log('-Deal Edit Handler')
                        props.navigation.navigate('UpdateDeal', {id:r_item.id, deals:deals, dealCode:dealCode})
                    }
                },
                { 
                    text: "Remove",
                    onPress:  () => {
                        console.log('-Deal Remove Handler')
                        dispatch(MerchantActions.removeDeal(r_item.id, dealCode))
                    }
                }
            ],
            { cancelable: true }
        ); 
    })

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    useEffect(()=>{
        props.navigation.setParams({submit:submitHandler});
    }, [submitHandler]);

    const footer = (
        <TouchableOpacity
            onPress={()=> {
                console.log('-Deal Add Handler')
                props.navigation.navigate('UpdateDeal', {id:r_item.id, deals:deals, dealCode:deals.length})
            }}
            style={styles.addContainer}
        >
            <View style={styles.addContainer}>
                <Ionicons name={'md-add-circle'} size={30} color={'black'} />
                <Text>Add Deal</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.screen}>
            <View style={styles.upperContainer}>
                <ProfileInput
                    merchant={r_item}
                    onInputChange={inputChangeHandler}
                />
            </View>
            <View style={styles.lowerContainer}>
                <DealList
                    dealData={deals}
                    onTap={dealTapHandler}
                    footer={footer}
                    merchantSide={true}
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
    },
    upperContainer:{
        width:'95%',
        height:190,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.backgrounddark,
        borderRadius:3,
        margin:'2.5%'
    },
    lowerContainer:{
        height:'55%',
        justifyContent:'center'
    },
    addContainer:{
        alignItems:'center',
        height:150, 
        margin:10,
    }
});

export default EditScreen;