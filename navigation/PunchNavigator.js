import React from 'react';
import { Ionicons } from '@expo/vector-icons';
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

const HomeNavigator = createStackNavigator({
    UserLogin: UserLoginScreen,
    UserSignUp: UserSignUpScreen,
    Home: {
        screen: UserHomeScreen
    },
    Explore:SearchMerchantScreen,
    Punch: PunchScreen,
}, {
    defaultNavigationOptions: defaultOptions
});

const MerchantNavigator = createStackNavigator({
    Login: {
        screen: MerchantLoginScreen
    },
    SignUp: {
        screen: MerchantSignUp
    },
    MerchantHome: {
        screen: MerchantHomeScreen
    },
    AddDeal:{
        screen:AddDealScreen
    }
}, {defaultNavigationOptions: defaultOptions});


const tabScreen = {
    Home: {
        screen: HomeNavigator, 
        navigationOptions:{
            tabBarIcon: (tabInfo) => {
                return (<Ionicons name='ios-restaurant' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
        }
    },
    Explore: {
        screen:ExploreNavigator,
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
? createMaterialBottomTabNavigator(tabScreen, {
    activeColor:Colors.lightLines,
    shifting:true
}) 
: createBottomTabNavigator(tabScreen, {
    tabBarOptions:{
        activeTintColor:Colors.lightLines,
    }
});


const MainNavigator = createDrawerNavigator({
    UserHome: {
        screen: MerchantTabNavigator,
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