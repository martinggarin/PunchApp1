import React, {useCallback, useReducer, useEffect, useState, useSelector} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Picker, ActionSheetIOS, TextInput, Alert, Button } from 'react-native';
import {useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';

const NAME_INPUT_CHANGE = 'NAME_INPUT_CHANGE';
const LOCATION_INPUT_CHANGE = 'LOCATION_INPUT_CHANGE';
const ID_INPUT_CHANGE = 'ID_INPUT_CHANGE';
const TYPE_INPUT_CHANGE = 'TYPE_INPUT_CHANGE';

const formReducer = (state, action) =>{
    const updatedValues = state.inputValues
    const updatedValidities = state.inputValidities
    switch(action.type){
        case NAME_INPUT_CHANGE:
            updatedValues.name = action.newValue
            updatedValidities.name = action.isValid
            break
        case LOCATION_INPUT_CHANGE:
            updatedValues.location = action.newValue
            updatedValidities.location = action.isValid
            break
        case TYPE_INPUT_CHANGE:
            updatedValues.type = action.newValue
            break
        case ID_INPUT_CHANGE:
            updatedValues.id = action.newValue
            updatedValidities.id = action.isValid
            break
        default:
            return {state}
    }
    var formIsValid = true
    for (const key in updatedValidities){
        if (updatedValidities[key] === false){
            formIsValid = false
        }
    }
    console.log(updatedValues)
    return {...state,
        inputValues:updatedValues,
        inputValidities:updatedValidities,
        formIsValid:formIsValid
    }
};


const UpdateEmployeeScreen = props => {
    console.log('Update Employee');
    const types = ['Manager', 'Employee']
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const r_id = props.navigation.getParam('id');
    const employees = props.navigation.getParam('employees');
    const employeeCode = props.navigation.getParam('employeeCode')
    const dispatch = useDispatch();
    if (employees === undefined){
        totalEmployees = 0
    }
    else{
        totalEmployees = employees.length
    }

    if (totalEmployees === employeeCode){
        var initialValues = {
            inputValues:{
                name: '',
                location: '',
                type: 'Employee',
                id:'',
                code: employeeCode
            },
            inputValidities:{
                name:false,
                location:false,
                id:''
            },
            formIsValid:false
        }        
        
    }
    else{
        var initialValues = {
            inputValues:{
                name: employees[employeeCode].name,
                location: employees[employeeCode].location,
                type: employees[employeeCode].type,
                id: employees[employeeCode].id,
                code: employeeCode
            },
            inputValidities:{
                name:true,
                location:true,
                id:''
            },
            formIsValid:true
        }
    }

    const [formState, dispatchFormState] = useReducer(formReducer, initialValues);
    
    const handleName = useCallback((text) => {
        console.log('-Input Change Handler')
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatchFormState({
            type: NAME_INPUT_CHANGE, 
            newValue: text, 
            isValid: isValid,
        })
    },[dispatchFormState]);

    const handleLocation = useCallback((text) => {
        console.log('-Input Change Handler')
        var isValid = true
        if (text.length === 0){
            isValid = false
        }
        dispatchFormState({
            type: LOCATION_INPUT_CHANGE, 
            newValue: text, 
            isValid: isValid,
        })
    },[dispatchFormState]);

    const handleType = useCallback((text) => {
        console.log('-Input Change Handler')
        dispatchFormState({
            type: TYPE_INPUT_CHANGE, 
            newValue: text, 
        })
    },[dispatchFormState]);

    const handleId = useCallback((text) => {
        console.log('-Input Change Handler')
        var isValid = true
        if ((text.length < 4) || text.indexOf('.') !== -1){
            isValid = false
        }
        dispatchFormState({
            type: ID_INPUT_CHANGE, 
            newValue: text, 
            isValid: isValid,
        })
    },[dispatchFormState]);

    const handleSubmit = useCallback( async () => {
        console.log('-Submit Employee Handler')
        if(!formState.formIsValid){
            Alert.alert('Invalid Inputs!' , 
                        'Please check your inputs...\n\n'
                        +'Employee Names and Locations must be at least 1 character\n\n'
                        +'Employee IDs must be a 4 digit and number', 
                        [{text: 'Okay'}]);
            return;
        };
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(MerchantActions.updateEmployee(
                r_id,
                formState.inputValues.name,
                formState.inputValues.location,
                formState.inputValues.type,
                formState.inputValues.id,
                formState.inputValues.code
            ));
            props.navigation.goBack();
        }catch(err){
            setError(err.message);
        }
        setIsLoading(false);

    },[formState, dispatch, r_id]);
    
    useEffect(() => {
            if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
            }
        }, [error]);


    return(
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Enter the employee's name:</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Name"
                            placeholderTextColor = {Colors.placeholderText}
                            defaultValue = {initialValues.inputValues.name}
                            autoCapitalize = "none"
                            onChangeText = {handleName}
                        />
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Enter the location where this employee works:</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "Location"
                            placeholderTextColor = {Colors.placeholderText}
                            defaultValue = {initialValues.inputValues.location}
                            autoCapitalize = "none"
                            onChangeText = {handleLocation}
                        />
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Select the appropriate employee level:</Text>
                    {Platform.OS === 'android' && <View style={styles.inputView}>
                        <Picker
                            selectedValue={initialValues.inputValues.type}
                            onValueChange={handleType}
                        >
                            <Picker.Item label="Manager" value="Manager" />
                            <Picker.Item label="Employee" value="Employee" />
                        </Picker>
                    </View>}
                    {Platform.OS === 'ios' && <TouchableOpacity style={styles.inputView} 
                        onPress={()=>{
                            ActionSheetIOS.showActionSheetWithOptions(
                                {
                                    options: ["Cancel", "Manager", "Employee"],
                                    title:'Type',
                                    cancelButtonIndex: 0
                                },
                                buttonIndex => {
                                    if (buttonIndex === 0) {
                                        // cancel action
                                    }else{
                                        handleType(types[buttonIndex-1]);
                                    }
                                }
                            )
                        }}>
                            <Text style={styles.input}>{formState.inputValues.type}</Text>
                        </TouchableOpacity>}
                    </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Enter the employee ID:</Text>
                    <View style={styles.inputView}>
                        <TextInput 
                            style = {styles.input}
                            keyboardType='decimal-pad'
                            maxLength={4}
                            underlineColorAndroid = "transparent"
                            placeholder = "4-Digit ID"
                            placeholderTextColor = {Colors.placeholderText}
                            defaultValue = {initialValues.inputValues.id}
                            autoCapitalize = "none"
                            onChangeText = {handleId}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.button}>
                <Button title='Submit' color={Colors.primary} onPress={handleSubmit} />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center'
    },
    container:{
        width:'95%',
        height:'40%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.primary,
        borderRadius:3,
        margin:'2.5%'
    },
    rowContainer: {
        height:'25%',
        width:'95%',
        justifyContent: 'center',
        //borderColor: Colors.borderDark,
        //borderWidth: 1,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
    },
    inputView:{
        marginBottom: Platform.OS == 'ios' ? 5 : 0 ,
        marginLeft:2,
        marginRight:2,
        borderColor: Colors.borderDark,
        borderBottomWidth: 1,
        height:"65%",
        justifyContent:'center'
    },
    input: {
        color:Colors.input,
        marginLeft: 5,
    },  
    button: {
        width:'50%',
        justifyContent:'center'
    } 
});

export default UpdateEmployeeScreen;