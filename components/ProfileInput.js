import React, {useReducer, useEffect} from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native'

import Colors from '../constants/Colors';

const TITLE_INPUT_CHANGE = 'TITLE_INPUT_CHANGE';
const PRICE_INPUT_CHANGE = 'PRICE_INPUT_CHANGE';
const TYPE_INPUT_CHANGE = 'TYPE_INPUT_CHANGE';
const ADDRESS_INPUT_CHANGE = 'ADDRESS_INPUT_CHANGE';
const CITY_INPUT_CHANGE = 'CITY_INPUT_CHANGE';

const profileInputReducer = (state, action) => {
    //console.log(action.type);
    switch(action.type){
        case TITLE_INPUT_CHANGE:
            action.values.title = action.newValue
            break
        case PRICE_INPUT_CHANGE:
            action.values.price = action.newValue
            break
        case TYPE_INPUT_CHANGE:
            action.values.type = action.newValue
            break
        case ADDRESS_INPUT_CHANGE:
            action.values.address = action.newValue
            break
        case CITY_INPUT_CHANGE:
            action.values.city = action.newValue
            break
        default:
            return {state}
    }
    return {...state,
        values: action.values,
        isValid: action.isValid,
        touched:true
    }
};

ProfileInput = props => {
    const initialValues = {
        title: props.merchant.title,
        type: props.merchant.type,
        price: props.merchant.price,
        address: props.merchant.address,
        city:props.merchant.city
    }
    const [inputState, dispatch] = useReducer(profileInputReducer, {
        values: initialValues,
        isValid: true,
        touched: false
    });
    const handleTitle = (text) => {
        isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:TITLE_INPUT_CHANGE, values:inputState.values, newValue:text, isValid:isValid})
    }
    const handlePrice = (text) => {
        isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:PRICE_INPUT_CHANGE, values:inputState.values, newValue:text, isValid:isValid})
    }
    const handleType = (text) => {
        isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:TYPE_INPUT_CHANGE, values:inputState.values, newValue:text, isValid:isValid})
    }
    const handleAddress = (text) => {
        isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:ADDRESS_INPUT_CHANGE, values:inputState.values, newValue:text, isValid:isValid})
    }
    const handleCity = (text) => {
        isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:CITY_INPUT_CHANGE, values:inputState.values, newValue:text, isValid:isValid})
    }

    //onINput change will be a function passed from parent. this will be called here every time
    //there is a change in the inputstate, which is when the text changes. 
    //this will allow for the parent to remain updated on the state of the child
    useEffect(()=>{
        if(inputState.touched){
            props.onInputChange(props.merchant.id, inputState.values, inputState.isValid);
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
                            placeholder = "Enter a Valid Merchant Title"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {inputState.values.title}
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
                            placeholder = "Enter a Valid Merchant Type"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {inputState.values.type}
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
                            placeholder = "Enter a Valid Price"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {inputState.values.price}
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
                            defaultValue = {inputState.values.address}
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
                            defaultValue = {inputState.values.city}
                            autoCapitalize = "none"
                            onChangeText = {handleCity}
                        />  
                    </View> 
                </View>   
            </View>
        </View>
    )
}

export default ProfileInput

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        width:'90%',
        height:'85%'
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
