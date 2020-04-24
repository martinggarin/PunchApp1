import React from 'react';
import {HeaderButton} from 'react-navigation-header-buttons';
import { Platform } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Colors from '../constants/Colors';

const CustomHeaderButton = props => {
    return(
        <HeaderButton
            {...props}
            IconComponent={Ionicons}
            iconSize={23}
            color={Colors.lines}
        />

    );
};

export default CustomHeaderButton;