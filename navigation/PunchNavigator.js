import {createStackNavigator} from 'react-navigation-stack'; 
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';

import UserHomeScreen from '../screens/user/UserHomeScreen';
import PunchScreen from '../screens/user/PunchScreen';
import UserLoginScreen from '../screens/user/UserLoginScreen';
import RewardScreen from '../screens/user/RewardScreen';
import SearchMerchantScreen from '../screens/user/SearchMerchantScreen';
import MerchantLoginScreen from '../screens/merchant/MerchantLoginScreen';
import MerchantHomeScreen from '../screens/merchant/MerchantProfileScreen';
import Colors from '../constants/Colors';

const defaultOptions = {
    headerStyle:{
        backgroundColor:Colors.backgrounddark
    },
    headerTintColor: Colors.lightLines,
};

const PunchNavigator = createStackNavigator({
    Home: { 
        screen: UserHomeScreen,
    },
    Punch: {
        screen: PunchScreen,
    },
    Login: {
        screen: UserLoginScreen
    },
    Reward:{
        screen: RewardScreen,
    },
    NewMerchant:{
        screen: SearchMerchantScreen
    }
},  
{
    defaultNavigationOptions: defaultOptions
});

const MerchantNavigator = createStackNavigator({
    Login: {
        screen: MerchantLoginScreen
    },
    Home: {
        screen: MerchantHomeScreen
    }
}, {defaultNavigationOptions: defaultOptions});

const MainNavigator = createDrawerNavigator({
    UserHome: {
        screen:PunchNavigator,
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