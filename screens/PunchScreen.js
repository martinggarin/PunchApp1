import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import PunchCard from '../components/PunchCard';
import {DUMMY} from '../data/Dummy-Data';
import ListItem from '../components/ListItem';

const PunchScreen = props => {
    const r_id = props.navigation.getParam('restaurant_id');
    const r_item = DUMMY.find(r => r.id === r_id);
    const [punch, setPunch] = useState(r_item.punches);

    const reward = r_item.deal.reward;
    const ammount = r_item.deal.ammount;

    const renderDeal = itemData =>{

        return(
            <ListItem 
                style={styles.listItem}
                title={itemData.item.reward}
                onClick={()=>{console.log('to rewards')}}
                color={r_item.color}

            />
        );
    };

    return(
        <View style={styles.screen}>
            <PunchCard style={{backgroundColor:r_item.color}}>
                <View style={styles.textContainer}>
                    <Text style={{...styles.punch, ...{color:'#30475e'}}}>Rewards: {punch}</Text>
                </View>
                <Text style={styles.cardText}>For {ammount} punches, you get a {reward}</Text>
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
    const r_id = navigationData.navigation.getParam('restaurant_id');
    const r_item = DUMMY.find(r => r.id === r_id);

    return{
        headerTitle: r_item.title,
        headerTitleStyle:{
            textAlign:'center',
            alignSelf:'center',
        },
        headerStyle:{
            backgroundColor:'#30475e'
        },
        headerTintColor:r_item.color
    };
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        //justifyContent:'center',
        //height:'50%',
        backgroundColor:'#222831'
    },
    listItem:{
        //flex:1,
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