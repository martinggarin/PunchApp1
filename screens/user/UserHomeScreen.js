import React, { useEffect, useCallback , useState} from 'react';
import { StyleSheet, TouchableOpacity, View, SafeAreaView, Text } from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import MerchantList from '../../components/MerchantList';
import * as MerchantActions from '../../store/actions/merchants';
import * as UserActions from '../../store/actions/user';


const UserHomeScreen = props => {
    console.log('User Home')
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const allMerchants = useSelector(state => state.merchants.availableMerchants);
    const display = useSelector(state => state.user.userMerchants);
    const u_id = useSelector(state => state.user.user).id;
    let updatedUserMerchants = [];
    const dispatch = useDispatch();

    // console.log('------allMerchants--------');
    // console.log(allMerchants);
    // console.log('------display-------------');
    // console.log(display)

    if(display && allMerchants.length > 0){
        for(const key in display){
            const merch = allMerchants.find(m=>m.id === display[key]);
            // console.log('....merch....');
            // console.log(merch);
            updatedUserMerchants.push(merch);
        }
    }
    // console.log('----updatedUserMerchants-----');
    // console.log(updatedUserMerchants);

    const loadMerchants = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            //console.log('________________');
            //console.log(u_id);
            //console.log('________________');
            await dispatch(MerchantActions.loadAllMerchants());
            await dispatch(UserActions.refreshUser(u_id));

        } catch (err) {
          setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
          'willFocus',
          loadMerchants
        );
        //console.log('will focus');
        //console.log(allMerchants);
        return () => {
          willFocusSub.remove();
        };
    }, [loadMerchants]);
    
    useEffect(() => {
        setIsLoading(true);
        loadMerchants().then(() => {
          setIsLoading(false);
          //console.log('is loading');
          //console.log(allMerchants);
        });
    }, [dispatch, loadMerchants]);    

    const footer = (<TouchableOpacity
        onPress={()=> props.navigation.navigate('Explore')}
        style={styles.addContainer}
    >
        <View style={styles.addContainer}>
            <Ionicons name={'md-add-circle'} size={50}/>
        </View>
    </TouchableOpacity>);

    if(updatedUserMerchants.length > 0){
        return(
            <SafeAreaView
            style={styles.screen}>
                <MerchantList 
                    onRefresh={loadMerchants}
                    refreshing={isRefreshing}
                    listData={updatedUserMerchants}
                    navigation={props.navigation}
                    routeName={'Punch'}
                    style={styles.merchantList}
                    color={Colors.background}
                    footer={footer}
                />
            </SafeAreaView>
        );
    }else{
        return(
            <View>
                <Text>There are no items, add some</Text>
            </View>);
    }
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.background,//this is the color for everything need to fix
    },
    addContainer:{
        alignItems:'center',
        height:150,
        margin:10,
        
    }, 
    merchantList:{
        flex:1
    }
});

export default UserHomeScreen;