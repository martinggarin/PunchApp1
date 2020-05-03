import React from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack'; 
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import UserHomeScreen from '../screens/user/UserHomeScreen';
import PunchScreen from '../screens/user/PunchScreen';
import UserLoginScreen from '../screens/user/UserLoginScreen';
import RewardScreen from '../screens/user/RewardScreen';
import SearchMerchantScreen from '../screens/user/SearchMerchantScreen';
import MerchantLoginScreen from '../screens/merchant/MerchantLoginScreen';
import MerchantHomeScreen from '../screens/merchant/MerchantProfileScreen';
import Colors from '../constants/Colors';
import AddDealScreen from '../screens/merchant/AddDealScreen';
import MerchantSignUp from '../screens/merchant/MerchantSignUpScreen';
import UserSignUpScreen from '../screens/user/UserSignUpScreen';
import ScanScreen from '../screens/merchant/ScanScreen';

const defaultOptions = {
    headerStyle:{
        backgroundColor:Colors.backgrounddark
    },
    headerTintColor: Colors.lightLines,
};

// const PunchNavigator = createStackNavigator({
//     Punch: {
//         screen: PunchScreen,
//     },
//     Reward:{
//         screen: RewardScreen,
//     },
// },  
// {
//     defaultNavigationOptions: defaultOptions
// });


const ExploreNavigator = createStackNavigator({
    Explore: {
        screen: SearchMerchantScreen
    },
    Punch: PunchScreen,
}, {
    defaultNavigationOptions: defaultOptions
});

const MerchantTabScreen = {
    Home: {
        screen: MerchantHomeScreen, 
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name='ios-restaurant' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
        }
    },
    Scan: {
        screen:ScanScreen,
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
        screen: UserHomeScreen, 
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name='ios-restaurant' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
        }
    },
    Rewards: {
        screen: RewardNavigator, 
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<AntDesign name='qrcode' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
        }
    },
    Explore: {
        screen:SearchMerchantScreen,
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name='ios-star' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
            activeColor:Colors.fontLight,
        }
    },
}
const MerchantTabNavigator = Platform.OS ==='android' 
? createMaterialBottomTabNavigator(MerchantTabScreen, {
    activeColor:Colors.lightLines,
    shifting:true
}) 
: createBottomTabNavigator(MerchantTabScreen, {
    tabBarOptions:{
        activeTintColor:Colors.lightLines,
    }
});

const UserTabNavigator = Platform.OS ==='android' 
? createMaterialBottomTabNavigator(tabScreen, {
    activeColor:Colors.lightLines,
    shifting:true
}) 
: createBottomTabNavigator(tabScreen, {
    tabBarOptions:{
        activeTintColor:Colors.lightLines,
    }
});
const MerchantNavigator = createStackNavigator({
    Login: {
        screen: MerchantLoginScreen
    },
    SignUp: {
        screen: MerchantSignUp
    },
    MerchantHome: {
        screen: MerchantTabNavigator
    },
    AddDeal:{
        screen:AddDealScreen
    }
}, {defaultNavigationOptions: defaultOptions});

const HomeNavigator = createStackNavigator({
    UserLogin: UserLoginScreen,
    UserSignUp: UserSignUpScreen,
    Home: {
        screen: UserTabNavigator
    },
    Explore:SearchMerchantScreen,
    Punch: PunchScreen,
}, {
    defaultNavigationOptions: defaultOptions
});

const RewardNavigator = createStackNavigator({
    Reward:{
        screen: RewardScreen
    },
    Punch: PunchScreen,
}, {
    defaultNavigationOptions: defaultOptions
})

const MainNavigator = createDrawerNavigator({
    UserHome: {
        screen: HomeNavigator,
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
    }
});

export default createAppContainer(MainNavigator);