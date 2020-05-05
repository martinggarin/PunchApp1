import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Button , TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DealList from '../../components/DealList';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';


const MerchantProfileScreen = props => {
    //get the param of email
    const email = props.navigation.getParam('email');
    const r_item = useSelector(state => state.merchants.myMerchant);
    const deals = useSelector(state => state.merchants.myDeals);

    console.log('merchant profile');
    console.log(deals);

    const footer = (
        <TouchableOpacity
            onPress={()=> props.navigation.navigate({
                    routeName:'AddDeal',
                    params:{
                        id: r_item.id
                    }
                })}
            style={styles.addContainer}
        >
        <View style={styles.addContainer}>
            <Ionicons name={'md-add-circle'} size={50} color={'black'} />
            <Text>Add Deal</Text>
        </View>
        </TouchableOpacity>
        );

    return(
        <View style={styles.screen}>
            <View style={{width:'95%', height:'20%', backgroundColor:Colors.backgrounddark, borderRadius:3, marginTop:'2.5%'}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems:'center', justifyContent:'space-between'}}>
                    <View style={{left:10}}>
                        <Text style={{margin:2, fontSize:24, fontWeight:'bold',}}>
                            {r_item.title}
                        </Text>
                        <Text>{r_item.price} • {r_item.foodType[0]}, {r_item.foodType[1]}</Text>
                        <Text style={styles.addressText}>{r_item.address}</Text>
                    </View>
                    <View style={{right:15}}>
                        <View>
                            <Text style={{fontWeight:'bold', textAlign:'center'}}>Total Deals</Text>
                            <Text style={{textAlign:'center'}}>{r_item.deal.length}</Text>
                        </View>
                        <View>
                            <Text style={{fontWeight:'bold', textAlign:'center'}}>Customers</Text>
                            <Text style={{textAlign:'center'}}>{r_item.deal.length}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{height:'77.5%',justifyContent:'center', marginTop:'2.5%'}}>
                <DealList 
                    dealData={deals}
                    footer={footer}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        //marginTop:20,
        backgroundColor:Colors.fontLight,
    }, 
    addContainer:{
        alignItems:'center',
        height:150,
        margin:10,
    }
});

export default MerchantProfileScreen;