import React, {useCallback, useReducer, useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import EmployeeList from '../../components/EmployeeList';
import Colors from '../../constants/Colors';
import * as MerchantActions from '../../store/actions/merchants';

const EmployeeScreen = props => {
    console.log('Employee');
    const [error, setError] = useState();
    const r_item = useSelector(state => state.merchants.myMerchant);
    
    const dispatch = useDispatch();

    let employees = useSelector(state => state.merchants.myEmployees);
    if (employees === undefined || employees === null){
        var totalEmployees = 0
        employees = []
    }
    else{
        var totalEmployees = employees.length
    }

    const employeeTapHandler = useCallback((employeeCode) => {
        Alert.alert(
            employees[employeeCode].name,
            "What would you like to do?",
            [{   
                text: "Edit", 
                onPress: () => {
                    console.log('-Employee Edit Handler')
                    props.navigation.navigate('UpdateEmployee', {id:r_item.id, employees:employees, employeeCode:employeeCode})
                }
            },{ 
                text: "Remove",
                onPress:  () => {
                    console.log('-Employee Remove Handler')
                    dispatch(MerchantActions.removeEmployee(r_item.id, employeeCode))
                },
            },{
                text: "Cancel",
                    onPress: () => {console.log('-Cancel Pressed')}, 
                    style:'cancel'
            }],
            { cancelable: true }
        ); 
    })

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const footer = (
        <TouchableOpacity
            onPress={()=> {
                console.log('-Employee Add Handler')
                props.navigation.navigate('UpdateEmployee', {id:r_item.id, employees:employees, employeeCode:totalEmployees})
            }}
            style={styles.addContainer}
        >
            <View style={styles.addContainer}>
                <Ionicons name={'md-add-circle'} size={30} color={Colors.fontDark} />
                <Text>Add Employee</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.screen}>
            <View style={styles.upperContainer}>
                <View style={styles.rowContainer}>
                    <Text style={{...styles.smallBoldText, width:'55%'}}>Name</Text>
                    <Text style={{...styles.smallBoldText, width:'30%'}}>Location</Text>
                    <Text style={{...styles.smallBoldText, width:'15%'}}>ID</Text>
                </View>
            </View>
            <View style={styles.lowerContainer}>
                <EmployeeList
                    employeeData={employees}
                    onTap={employeeTapHandler}
                    footer={footer}
                />
            </View>
        </View>
    );
};

EmployeeScreen.navigationOptions = () => {
    return{
        title:'Employees',
    }
}

const styles = StyleSheet.create({
    screen:{
        alignItems:'center',
        height:'100%',
        width:'100%',
    },
    upperContainer:{
        width:'95%',
        height:'5%',
        alignItems:'center',
        backgroundColor:Colors.primary,
        borderRadius:3,
        marginTop:10
    },
    lowerContainer:{
        height:'95%',
        width:'95%',
    },
    rowContainer:{
        flex: 1,
        marginLeft:10,
        flexDirection: 'row',
        alignItems:'center'
    },
    smallBoldText:{
        //marginLeft:5,
        fontWeight:'bold',
    },
    addContainer:{
        alignItems:'center',
        height:150, 
        margin:10,
    }
});

export default EmployeeScreen;