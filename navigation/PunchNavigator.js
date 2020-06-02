import React from 'react';
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import {Platform, SafeAreaView, Button, View} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack'; 
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {useSelector, useDispatch} from 'react-redux'

import UserHomeScreen from '../screens/user/UserHomeScreen';
import PunchScreen from '../screens/user/PunchScreen';
import UserLoginScreen from '../screens/user/UserLoginScreen';
import RewardScreen from '../screens/user/RewardScreen';
import SearchMerchantScreen from '../screens/user/SearchMerchantScreen';
import MerchantLoginScreen from '../screens/merchant/MerchantLoginScreen';
import MerchantHomeScreen from '../screens/merchant/MerchantProfileScreen';
import Colors from '../constants/Colors';
import EditScreen from '../screens/merchant/EditScreen';
import UpdateDealScreen from '../screens/merchant/UpdateDealScreen';
import ScanScreen from '../screens/merchant/ScanScreen';
import * as MerchantActions from '../store/actions/merchants';
import * as UserActions from '../store/actions/user';

const defaultOptions = {
    headerStyle:{
        backgroundColor:Colors.backgrounddark
    },
    headerTintColor: Colors.lines,
};

const MerchantHomeNavigator = createStackNavigator({
    MerchantHome:{
        screen: MerchantHomeScreen,
        navigationOptions: { title: 'Merchant Home' }
    },
    Edit: EditScreen,
    Scan: ScanScreen,
    UpdateDeal:{
        screen: UpdateDealScreen,
        navigationOptions: { title: 'Update Deal' }
    }
}, {
    defaultNavigationOptions: defaultOptions
})

const ScanNavigator = createStackNavigator({
    Scan:{
        screen: ScanScreen,
        navigationOptions: { title: 'Scan' }
    }
}, {
    defaultNavigationOptions: defaultOptions
})

const UserHomeNavigator = createStackNavigator({
    Home:{
        screen: UserHomeScreen,
        navigationOptions: { title: 'Home' }
    },
    Punch: PunchScreen,
}, {
    defaultNavigationOptions: defaultOptions
})

const RewardNavigator = createStackNavigator({
    Reward:{
        screen: RewardScreen,
        navigationOptions: { title: 'Rewards' }
    },
    Punch: PunchScreen,
}, {
    defaultNavigationOptions: defaultOptions
})

const ExploreNavigator = createStackNavigator({
    Explore: {
        screen: SearchMerchantScreen,
        navigationOptions: { title: 'Explore' }
    },
    Punch: PunchScreen,
}, {
    defaultNavigationOptions: defaultOptions
});


const MerchantTabScreen = {
    Home: {
        screen: MerchantHomeNavigator, 
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<MaterialCommunityIcons name='home-analytics' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
        }
    },
    Scan: {
        screen:ScanNavigator,
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name='ios-qr-scanner' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
            activeColor:Colors.fontLight,
        }
    },
}

const tabScreen = {
    Home: {
        screen: UserHomeNavigator, 
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<MaterialCommunityIcons name='home-account' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
        }
    },
    Reward: {
        screen: RewardNavigator, 
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<AntDesign name='qrcode' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
        }
    },
    Explore: {
        screen:ExploreNavigator,
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name='ios-search' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
            activeColor:Colors.fontLight,
        }
    },
}

const MerchantTabNavigator = Platform.OS ==='android' 
? createMaterialBottomTabNavigator(MerchantTabScreen, {
    activeColor:Colors.lines,
    shifting:true
}) 
: createBottomTabNavigator(MerchantTabScreen, {
    tabBarOptions:{
        activeTintColor:Colors.backgrounddark,
    }
});

const UserTabNavigator = Platform.OS ==='android' 
? createMaterialBottomTabNavigator(tabScreen, {
    activeColor:Colors.lines,
    shifting:true
}) 
: createBottomTabNavigator(tabScreen, {
    tabBarOptions:{
        activeTintColor:Colors.backgrounddark,
    }
});


const MerchantNavigator = createStackNavigator({
    MerchantLogin: {
        screen: MerchantLoginScreen,
        navigationOptions:{gestureEnabled:false}
    },
    MerchantHome: {
        screen: MerchantTabNavigator,
        navigationOptions: {
            headerShown:false,
            gestureEnabled:false
        }
    },
    Edit:EditScreen,
    UpdateDeal:UpdateDealScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                size={23}
                color={drawerConfig.tintColor}
            />
        ),
    },
    defaultNavigationOptions: defaultOptions
});

const UserNavigator = createStackNavigator({
    UserLogin: {
        screen: UserLoginScreen,
        navigationOptions: {gestureEnabled:false}
    },
    Home: {
        screen: UserTabNavigator,
        navigationOptions: {
            headerShown:false,
            gestureEnabled: false
        }
    },
    Punch: PunchScreen,
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
                size={23}
                color={drawerConfig.tintColor}
            />
        ),
    },
    defaultNavigationOptions: defaultOptions
});


const MainNavigator = createDrawerNavigator({
    UserHome: {
        screen: UserNavigator,
        navigationOptions:{
            drawerLabel:'Home'
        }
    },
    MerchantHome:{
        screen: MerchantNavigator,
        navigationOptions:{
            drawerLabel:'Merchant'
        }
    }
}, {
    contentOptions:{
        activeTintColor:Colors.header,
    },
    contentComponent: props => {
        const user = useSelector(state => state.user.user)
        const merchant = useSelector(state => state.merchants.myMerchant);
        if (user.id || merchant.id) {
            var showLogout = true
        }else{
            var showLogout = false
        }

        const dispatch = useDispatch()
        return (
            <View style={{flex:1, marginTop:20}}>
                <SafeAreaView forceInset={{top:'always', horizontal:'never'}}>
                    <DrawerNavigatorItems style={{}} {...props}/>
                    <View style={{alignItems:'center', marginTop:5}}>
                        <View style={{width:'50%'}}>
                            {showLogout && <Button 
                                title='Logout'
                                color={Colors.darkLines}
                                onPress={() => {
                                    props.navigation.navigate('MerchantLogin')
                                    dispatch(MerchantActions.logoutMerchant())
                                    props.navigation.navigate('UserLogin')
                                    dispatch(UserActions.logoutUser())
                                }}
                            />}
                        </View>
                    </View>
                    
                </SafeAreaView>
            </View>
        )
    }
});


export default createAppContainer(MainNavigator);