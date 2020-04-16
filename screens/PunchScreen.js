import React, {useState} from 'react';
import { View, Text, StyleSheet, Flatlist, Button } from 'react-native';
import PunchCard from '../components/PunchCard';
import {DUMMY} from '../data/Dummy-Data';

const PunchScreen = props => {
    const r_id = props.navigation.getParam('restaurant_id');
    const r_item = DUMMY.find(r => r.id === r_id);
    const [punch, setPunch] = useState(r_item.punches);

    const reward = r_item.getDeal().getReward();
    const ammount = r_item.getDeal().getAmmount();

    const updatePunches = () => {
        r_item.addPunch();
        setPunch(r_item.punches);
    };
    const redeemPunches = () => {
        r_item.redeem();
        setPunch(r_item.punches);
    };

    return(
        <View style={styles.screen}>
            <PunchCard style={{backgroundColor:r_item.color}}>
                <View style={styles.textContainer}>
                    <Text style={{...styles.punch, ...{color:'#30475e'}}}>Rewards: {punch}</Text>
                </View>
                <Text style={styles.cardText}>For {ammount} punches, you get a {reward}</Text>
                <View style={styles.buttonContainer}>
                    <Button title='REWARD' onPress={updatePunches}/>
                    <Button title='REDEEM' onPress={redeemPunches} />
                </View>
            </PunchCard>
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
}
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        height:'50%',
        backgroundColor:'#222831'
    },
    cardText:{
        fontSize:27,
        //marginHorizontal:20,
        //alignItems:'center',
        justifyContent:'center',
        textAlign:'center',
        marginVertical:5
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