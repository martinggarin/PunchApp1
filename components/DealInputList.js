import React, {useReducer, useCallback} from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import DealInput from './DealInput';
import RewardBalance from './RewardBalance';
import { FlingGestureHandler } from 'react-native-gesture-handler';

import Deal from '../models/Deal';
const DEAL_INPUT_CHANGE = 'DEAL_INPUT_CHANGE'

const dealInputListReducer = (state, action) => {
    
    switch(action.type){
        
        case DEAL_INPUT_CHANGE:
            return {...state,
                deals: action.deals,
                isValid: action.isValid,
                touched:true
            }
        default:
            return {state}
    }
};

const DealInputList = props => {
    
    const [formState, dispatchFormState] = useReducer(dealInputListReducer, {
        deals: props.dealData,
        isValid:true,
        touched:false
    });

    const footer = (
        <TouchableOpacity
            onPress={()=> props.onAdd(props.merchantID)}
            style={styles.addContainer}
        >
            <View style={styles.addContainer}>
                <Ionicons name={'md-add-circle'} size={30} color={'black'} />
                <Text>Add Deal</Text>
            </View>
        </TouchableOpacity>
    )
    const handleDealList = useCallback((deal, isValid) => {
        console.log('Deal List Handler')
        
        const dealList = props.dealData;
        const updatedDealList = [];
        for(const key in dealList){
            if (dealList[key].code === deal.code){
                updatedDealList.push(
                    new Deal(
                        deal.ammount, deal.reward, deal.code
                    )
                );
            }
            else {
                updatedDealList.push(
                    new Deal(
                        dealList[key].ammount, dealList[key].reward, dealList[key].code
                    )
                );
            }   
        }
        console.log(updatedDealList)
        dispatchFormState({
            type:DEAL_INPUT_CHANGE,
            deals: updatedDealList,
            isValid: isValid
        })
        props.onInputChange(updatedDealList, isValid)
    },[dispatchFormState]);

    const renderDeal = itemData =>{
        return(
            <View style={{height:70, marginLeft:10, marginRight:10, alignContent:'center'}}>
                <DealInput 
                    id={props.id}
                    deal={itemData.item}
                    onInputChange={handleDealList}
                    onRemove={props.onRemove}
                />
            </View>
        );
    };
    return (
        <View style = {styles.container}>
            <FlatList 
                data={props.dealData}
                renderItem={renderDeal}
                keyExtractor={(item, index) => item.reward}
                ListFooterComponent={footer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        width:'100%',
        height:'85%'
    }
})
export default DealInputList;