import React, {useCallback, useEffect, useState}from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import Colors from '../../constants/Colors';
import MerchantList from '../../components/MerchantList';
import * as MerchantActions from '../../store/actions/merchants';

const ExploreScreen = props => {
    console.log('Explore');
    const display = useSelector(state => state.merchants.availableMerchants);
    const faves = useSelector(state => state.user.userMerchants);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    //console.log('----display------');
    //console.log(display);
    const dispatch = useDispatch();

    const loadMerchants = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
          await dispatch(MerchantActions.loadAllMerchants());
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
    
        return () => {
          willFocusSub.remove();
        };
      }, [loadMerchants]);
    
      useEffect(() => {
        setIsLoading(true);
        loadMerchants().then(() => {
          setIsLoading(false);
        });
      }, [dispatch, loadMerchants]);

    return(
        <SafeAreaView
        style={styles.screen}>
            <MerchantList 
                listData={display}
                navigation={props.navigation}
                routeName={'Punch'}
                style={styles.merchantList}
                color={Colors.background}
                showDeals={true}
            />
        </SafeAreaView>
    );
};

ExploreScreen.navigationOptions = navData => {
    return {
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
        backgroundColor:Colors.background
    }
});

export default ExploreScreen;