import React, {useState, useCallback, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PunchCard from '../../components/PunchCard';
import {useSelector, useDispatch} from 'react-redux';
import ListItem from '../../components/ListItem';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import {toggleFav} from '../../store/actions/merchants';

const PunchScreen = props => {
    const r_id = props.navigation.getParam('restaurant_id');
    const r_item = useSelector(state => state.merchants.availableRestaurants).find(r=> r.id === r_id);
    const faves = useSelector(state => state.merchants.userRestaurants);
    const isFav = faves.some(r => r.id === r_id);

    const dispatch = useDispatch();
    const toggleFavHandler = useCallback(()=>{
        dispatch(toggleFav(r_id));
    }, [r_id, dispatch]);

    useEffect(()=>{
        props.navigation.setParams({isFav:isFav});
    }, [isFav]);

    useEffect(()=>{
        props.navigation.setParams({toggleFav:toggleFavHandler});
    }, [toggleFavHandler]);

    const renderDeal = itemData =>{
        return(
            <ListItem 
                style={styles.listItem}
                title={itemData.item.reward}
                onClick={()=>{console.log('to rewards')}}
                color={Colors.background}
            />
        );
    };

    return(
        <View style={styles.screen}>
            <PunchCard style={{backgroundColor:Colors.backgrounddark}}>
                <View style={styles.textContainer}>
                    <Text style={{...styles.punch, ...{color:Colors.lightLines}}}>Rewards:</Text>
                </View>
                <View style={styles.buttonContainer}>
                    
                </View>
            </PunchCard>
            <View style={styles.listContainer}>
                <FlatList 
                    data={r_item.deal}
                    renderItem={renderDeal}
                    keyExtractor={(item, index) => item.reward}
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
    listItem:{
        flex:1,
        height:150
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
        justifyContent:'center',
        width:'80%',

    }
});
export default PunchScreen;