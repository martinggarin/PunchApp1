import React, {useState, useCallback, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import PunchCard from '../../components/PunchCard';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import {toggleFav} from '../../store/actions/user';
import DealList from '../../components/DealList';
import RewardBalance from '../../components/RewardBalance';
import { Ionicons } from '@expo/vector-icons';

const PunchScreen = props => {
    const r_id = props.navigation.getParam('merchant_id');
    console.log(r_id);
    const r_item = useSelector(state => state.merchants.availableMerchants).find(r=> r.id === r_id);
    const faves = useSelector(state => state.user.userMerchants);
    const isFav = faves.some(r => r === r_id);
    const u_id = useSelector(state=> state.user.user.id);
    
    const rs = useSelector(state => state.user.userRewards);
    const hasRS = rs.some(r => r.r_id === r_id);
    let loyaltyPoints = 0;
    if(hasRS){
        loyaltyPoints = rs.find(r=>r.r_id === r_id).ammount;
        }

    const dispatch = useDispatch();

    const toggleFavHandler = useCallback(()=>{
        dispatch(toggleFav(r_id, u_id));
    }, [r_id, dispatch, u_id]);

    useEffect(()=>{
        props.navigation.setParams({isFav:isFav});
    }, [isFav]);

    useEffect(()=>{
        props.navigation.setParams({toggleFav:toggleFavHandler});
    }, [toggleFavHandler]);

    return(
        <View style={styles.screen}>
            <PunchCard style={{backgroundColor:Colors.backgrounddark}}>
                <View style={styles.textContainer}>
                   <RewardBalance 
                        balance={loyaltyPoints}
                        size={20}
                   />
                   <Ionicons name={'md-add-circle'} size={75}/>
                </View>
                <View style={styles.buttonContainer}>
                    
                </View>
            </PunchCard>
            <View style={styles.listContainer}>
                <DealList 
                    merchantSide={false}
                    dealData={r_item.deal}
                />
            </View>
        </View>
    );
};

PunchScreen.navigationOptions = navigationData => {
    const r_title = navigationData.navigation.getParam('title');
    const isFav = navigationData.navigation.getParam('isFav');
    const toggleFav = navigationData.navigation.getParam('toggleFav');

    return{
        headerTitle: r_title,
        headerTitleStyle:{
            textAlign:'center',
            alignSelf:'center',
        },
        headerStyle:{
            backgroundColor:Colors.header
        },
        headerTintColor:Colors.lines, 
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='favorites'
                    iconName={isFav ? 'ios-star' : 'ios-star-outline'}
                    onPress={toggleFav}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        //justifyContent:'center',
        //height:'50%',
        backgroundColor:Colors.background
    },
    listContainer:{
        flex:1,
        height:'50%',
        width:'100%',
        borderRadius:10,
    },
    cardText:{
        fontSize:27,
        //marginHorizontal:20,
        //alignItems:'center',
        justifyContent:'center',
        textAlign:'center',
        marginTop:5
    }, 
    buttonContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'60%',
        marginVertical:10,
    },
    punch:{
        fontSize:35,
        color:'white',
        textAlign:'center'
    },
    textContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'70%',
        marginStart:10

    }
});
export default PunchScreen;