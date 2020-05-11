import React from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack'; 
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

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
import MerchantSignUpScreen from '../screens/merchant/MerchantSignUpScreen';
import UserSignUpScreen from '../screens/user/UserSignUpScreen';
import ScanScreen from '../screens/merchant/ScanScreen';


const defaultOptions = {
    headerStyle:{
        backgroundColor:Colors.backgrounddark
    },
    headerTintColor: Colors.lightLines,
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
                return (<Ionicons name='ios-restaurant' size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.header,
        }
    },
    ScanNavigator: {
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
        screen: UserHomeNavigator, 
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
    Login: MerchantLoginScreen,
    SignUp: MerchantSignUpScreen,
    MerchantHome: {
        screen: MerchantTabNavigator,
        navigationOptions: {headerShown:false}
    },
    Edit:EditScreen,
    UpdateDeal:UpdateDealScreen
}, {
    defaultNavigationOptions: defaultOptions
});

const UserNavigator = createStackNavigator({
    UserLogin: UserLoginScreen,
    UserSignUp: UserSignUpScreen,
    Home: {
        screen: UserTabNavigator,
        navigationOptions: {headerShown:false}
    },
    Punch: PunchScreen,
}, {
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
    }
});


export default createAppContainer(MainNavigator);