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
            <View style={styles.upperContainer}>
                <Text style={styles.text}>
                    {r_item.title}
                </Text>
            </View>
            
            <View style={styles.lowerContainer}>
                <DealList 
                    dealData={deals}
                    footer={footer}
                />
            </View>
        </View>
    );
};
MerchantProfileScreen.navigationOptions = navData => {
    
    return {
        headerTitle:'Merchant Home',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title="Menu" iconName='md-menu' onPress={()=>{
                    navData.navigation.toggleDrawer();
                }} />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        //marginTop:20,
        paddingTop:20,
        backgroundColor:Colors.fontLight,
    }, 
    upperContainer:{
        width:'90%',
        height:100,
        backgroundColor:Colors.backgrounddark,
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        fontSize:20,
        color:Colors.lines
    },
    lowerContainer:{
        backgroundColor:Colors.lines,
        padding:10,
        justifyContent:'center',
        width:'90%',
        height:'100%',
        borderColor:'black',
        //borderWidth:1,
        margin:10
    },
    addContainer:{
        alignItems:'center',
        height:150,
        margin:0,
        
    },
});

export default MerchantProfileScreen;