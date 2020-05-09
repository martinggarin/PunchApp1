import React, {useReducer, useEffect} from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const REWARD_INPUT_CHANGE = 'REWARD_INPUT_CHANGE'
const AMMOUNT_INPUT_CHANGE = 'AMMOUNT_INPUT_CHANGE'

const dealInputReducer = (state, action) => {
    switch(action.type){
        case REWARD_INPUT_CHANGE:
            action.deal.reward = action.newValue
            break
        case AMMOUNT_INPUT_CHANGE:
            action.deal.ammount = action.newValue
            break
        default:
            return {state}
    }
    return {...state,
        deal: action.deal,
        isValid: action.isValid,
        touched: true
    }
};

const DealInput = props => {
    const initialValues = {
        reward: props.deal.reward,
        ammount: props.deal.ammount,
        code: props.deal.code
    }
    const [inputState, dispatch] = useReducer(dealInputReducer, {
        deal: initialValues,
        isValid: true,
        touched: false
    });
    const handleReward = (text) => {
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatch({type:REWARD_INPUT_CHANGE, deal:inputState.deal, newValue:text, isValid:isValid})
    }
    const handleAmmount = (text) => {
        var isValid = true
        if (text.length === 0 || isNaN(text)){
            isValid = false
        }
        dispatch({type:AMMOUNT_INPUT_CHANGE, deal:inputState.deal, newValue:text, isValid:isValid})
    }
    const handleRemove = () => {
        props.onRemove(inputState.deal.code)
    }
    useEffect(()=>{
        if(inputState.touched){
            props.onInputChange(inputState.deal, inputState.isValid);
        }
    }, [inputState, props.onInputChange]);

    return(
        <View style={{justifyContent:'center', borderColor:Colors.lightLines, borderBottomWidth:1, height:'100%'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                <View style={styles.inputView}>
                    <TextInput 
                        style = {styles.input}
                        underlineColorAndroid = "transparent"
                        placeholder = "Enter a Reward Name"
                        placeholderTextColor = {Colors.darkLines}
                        defaultValue = {initialValues.reward}
                        autoCapitalize = "none"
                        onChangeText = {handleReward}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput 
                        style = {styles.input}
                        underlineColorAndroid = "transparent"
                        placeholder = "Enter a Reward Ammount"
                        placeholderTextColor = {Colors.darkLines}
                        defaultValue = {initialValues.ammount.toString()}
                        autoCapitalize = "none"
                        onChangeText = {handleAmmount}
                    />
                </View>
                <TouchableOpacity onPress={handleRemove}>
                    <Ionicons 
                        name="md-remove-circle"
                        size={24}
                        color="red"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputView:{
        marginLeft:2,
        marginRight:2,
        borderColor: 'black',
        borderWidth: 1,
    },
    input: {
        color:'black',
        marginLeft: 5,
    }
})

export default DealInput;