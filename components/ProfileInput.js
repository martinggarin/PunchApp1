import React, {useReducer, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'

import Colors from '../constants/Colors';

const TITLE_INPUT_CHANGE = 'TITLE_INPUT_CHANGE';
const PRICE_INPUT_CHANGE = 'PRICE_INPUT_CHANGE';
const TYPE_INPUT_CHANGE = 'TYPE_INPUT_CHANGE';
const ADDRESS_INPUT_CHANGE = 'ADDRESS_INPUT_CHANGE';
const CITY_INPUT_CHANGE = 'CITY_INPUT_CHANGE';

const profileInputReducer = (state, action) => {
    const updatedValues = state.inputValues
    const updatedValidities = state.inputValidities
    switch(action.type){
        case TITLE_INPUT_CHANGE:
            updatedValues.title = action.newValue
            updatedValidities.title = action.isValid
            break
        case PRICE_INPUT_CHANGE:
            updatedValues.price = action.newValue
            updatedValidities.price = action.isValid
            break
        case TYPE_INPUT_CHANGE:
            updatedValues.type = action.newValue
            updatedValidities.type = action.isValid
            break
        case ADDRESS_INPUT_CHANGE:
            updatedValues.address = action.newValue
            updatedValidities.address = action.isValid
            break
        case CITY_INPUT_CHANGE:
            updatedValues.city = action.newValue
            updatedValidities.city = action.isValid
            break
        default:
            return {state}
    }
    return {...state,
        inputValues:updatedValues,
        inputValidities:updatedValidities,
        touched:true
    }
};

ProfileInput = props => {

    const initialValues = {
        inputValues:{
            title: props.merchant.title,
            type: props.merchant.type,
            price: props.merchant.price,
            address: props.merchant.address,
            city: props.merchant.city
        },
        inputValidities:{
            title: true,
            type: true,
            price: true,
            address: true,
            city: true
        },
        touched:false
    }
    const [inputState, dispatch] = useReducer(profileInputReducer, initialValues);

    const handleTitle = (text) => {
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:TITLE_INPUT_CHANGE, values:inputState.inputValues, newValue:text, isValid:isValid})
    }
    const handlePrice = (text) => {
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:PRICE_INPUT_CHANGE, values:inputState.inputValues, newValue:text, isValid:isValid})
    }
    const handleType = (text) => {
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:TYPE_INPUT_CHANGE, values:inputState.inputValues, newValue:text, isValid:isValid})
    }
    const handleAddress = (text) => {
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:ADDRESS_INPUT_CHANGE, values:inputState.inputValues, newValue:text, isValid:isValid})
    }
    const handleCity = (text) => {
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:CITY_INPUT_CHANGE, values:inputState.inputValues, newValue:text, isValid:isValid})
    }

    //onINput change will be a function passed from parent. this will be called here every time
    //there is a change in the inputstate, which is when the text changes. 
    //this will allow for the parent to remain updated on the state of the child
    useEffect(()=>{
        if(inputState.touched){
            props.onInputChange(inputState.inputValues, inputState.inputValidities);
        }
    }, [inputState, props.onInputChange]);

    return (
        <View style = {styles.container}>
            <View style={styles.rowView}>
                <View style={styles.singleFieldView}>
                    <Text style={styles.text}>Merchant Title</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Merchant Title"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {initialValues.inputValues.title}
                            autoCapitalize = "none"
                            onChangeText = {handleTitle}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.rowView}>
                <View style={styles.leftFieldView}>
                    <Text style={styles.text}>Type</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Merchant Type"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {initialValues.inputValues.type}
                            autoCapitalize = "none"
                            onChangeText = {handleType}
                        />
                    </View>
                </View>
                <View style={styles.rightFieldView}>
                    <Text style={styles.text}>Price</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Price ($)"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {initialValues.inputValues.price}
                            autoCapitalize = "none"
                            onChangeText = {handlePrice}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.rowView}>
                <View style={styles.leftFieldView}>
                    <Text style={styles.text}>Address</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Address"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {initialValues.inputValues.address}
                            autoCapitalize = "none"
                            onChangeText = {handleAddress}
                        />  
                    </View> 
                </View>   
                <View style={styles.rightFieldView}>
                    <Text style={styles.text}>City</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "City"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {initialValues.inputValues.city}
                            autoCapitalize = "none"
                            onChangeText = {handleCity}
                        />  
                    </View> 
                </View>   
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        width:'90%',
        height:'90%'
    },
    rowView: {
        flex: 1, 
        flexDirection: 'row',
        height:'33%',
        width:'100%',
        justifyContent: 'center',
        alignItems:'center',
        //borderColor: 'black',
        //borderWidth: 1,
    },
    singleFieldView: {
        width:'100%',
        height:'100%'
    },
    leftFieldView:{
        marginRight:'2.5%',
        width:'57.5%'
    },
    rightFieldView:{
        marginLeft:'2.5%',
        width:'37.5%'
    },
    inputView:{
        marginLeft:2,
        marginRight:2,
        borderColor: 'black',
        borderWidth: 1,
    },
    input: {
        color:'black',
        marginLeft: 5,
    },   
    text: {
        fontSize: 14,
        fontWeight: "bold",
    },
})

export default ProfileInput