import {createStackNavigator} from 'react-navigation-stack'; 
import {createAppContainer} from 'react-navigation';

import UserHomeScreen from '../screens/UserHomeScreen';
import PunchScreen from '../screens/PunchScreen';
import LoginScreen from '../screens/LoginScreen';

const PunchNavigator = createStackNavigator({
    Home: { 
        screen: UserHomeScreen,
    },
    Punch: {
        screen: PunchScreen,
    },
    Login: LoginScreen,
},  {
    defaultNavigationOptions:{
        headerStyle:{
            backgroundColor:'#30475e'
        },
        headerTintColor:'#ececec',
    }
});

export default createAppContainer(PunchNavigator);