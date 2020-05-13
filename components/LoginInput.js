import React, {useReducer, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import Colors from '../constants/Colors';

const EMAIL_INPUT_CHANGE = 'EMAIL_INPUT_CHANGE';
const PASSWORD_INPUT_CHANGE = 'PASSWORD_INPUT_CHANGE';

const loginInputReducer = (state, action) =>{
    const updatedValues = state.inputValues
    const updatedValidities = state.inputValidities
    switch(action.type){
        case EMAIL_INPUT_CHANGE:
            updatedValues.email = action.newValue
            updatedValidities.email = action.isValid
            break
        case PASSWORD_INPUT_CHANGE:
            updatedValues.password = action.newValue
            updatedValidities.password = action.isValid
            break
        default:
            return state;
    }
    return {...state,
        inputValues:updatedValues,
        inputValidities:updatedValidities,
        touched:true
    }
};

const LoginInput = props => {
    const initialValues = {
        inputValues:{
            email:'',
            password:''
        },
        inputValidities:{
            email:false,
            password:false
        },
        touched:false
    }

    const [inputState, dispatch] = useReducer(loginInputReducer, initialValues);

    const handleEmail = (text) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if ((text.length === 0) || !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        dispatch({type:EMAIL_INPUT_CHANGE, newValue:text, isValid:isValid})
    }
    const handlePassword = (text) => {
        let isValid = true;
        if (text.length === 0) {
            isValid = false;
        }
        dispatch({type:PASSWORD_INPUT_CHANGE, newValue:text, isValid:isValid})
    }

    //onInputChange will be a function passed from parent. this will be called here every time
    //there is a change in the inputstate, which is when the text changes. 
    //this will allow for the parent to remain updated on the state of the child
    useEffect(()=>{
        if(inputState.touched){
            props.onInputChange(inputState.inputValues, inputState.inputValidities);
        }
    }, [inputState, props.onInputChange]);

    return(
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <View style={styles.fieldView}>
                    <Text style={styles.text}>EMAIL</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Enter Your Email Address"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {initialValues.inputValues.email}
                            autoCapitalize = "none"
                            onChangeText = {handleEmail}
                        />
                    </View>
                </View>
                <View style={styles.fieldView}>
                    <Text style={styles.text}>PASSWORD</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Enter Your Password"
                            placeholderTextColor = {Colors.darkLines}
                            defaultValue = {initialValues.inputValues.password}
                            autoCapitalize = "none"
                            onChangeText = {handlePassword}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.lowerContainer}>
                <View style={styles.buttonContainer}>
                    <Button title='Login' color={Colors.backgrounddark} onPress={props.onLogin}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title='Sign Up' color={Colors.darkLines} onPress={props.onSignUp} />
                </View>
                
            </View>
        </View>        
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        height:'100%',
        width:'100%',
    },
    upperContainer:{
        width:'95%',
        height:200,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.backgrounddark,
        borderRadius:3,
        margin:'2.5%'
    },
    lowerContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        width:'100%',
        height:'10%',
    },
    fieldView: {
        width:'90%',
        height:'40%',
        justifyContent:'center',
    },
    inputView:{
        height:30,
        marginLeft:2,
        marginRight:2,
        borderColor: 'black',
        borderBottomWidth: 1,
    },
    input: {
        color:'black',
        marginLeft: 5,
    },   
    text: {
        fontSize: 14,
        fontWeight: "bold",
    },
    buttonContainer:{
        width:'40%'
    }
})

export default LoginInput