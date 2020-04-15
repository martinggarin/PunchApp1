import React, {useState} from 'react';
import { View, Text, StyleSheet, Flatlist, Button } from 'react-native';
import PunchCard from '../components/PunchCard';
import {DUMMY} from '../data/Dummy-Data';

const PunchScreen = props => {
    const r_id = props.navigation.getParam('restaurant_id');
    const r_item = DUMMY.find(r => r.id === r_id);
    const [punch, setPunch] = useState(r_item.punches);

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
                <Text style={styles.cardText}>{r_item.title}</Text>
                <Text style={styles.punch}>{punch}</Text>
                <View style={styles.buttonContainer}>
                    <Button title='PUNCH' onPress={updatePunches}/>
                    <Button title='REDEEM' onPress={redeemPunches} />
                </View>
            </PunchCard>
        </View>
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        height:'50%'
    },
    cardText:{
        fontSize:30,
        marginHorizontal:20,
        alignItems:'center',
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
        fontSize:40,
        color:'white'
    }
});

export default PunchScreen;