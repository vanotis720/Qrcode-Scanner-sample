import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';
import ScanScreen from '../screens/ScanScreen';
import GenerateScreen from '../screens/GenerateScreen';
import HistoryScreen from '../screens/HistoryScreen';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Scanner':
                            iconName = 'barcode-scan-outline';
                            break;
                        case 'Générer':
                            iconName = 'qrcode-scan-outline';
                            break;
                        case 'Historique':
                            iconName = 'history';
                            break;
                        default:
                            iconName = 'circle-outline';
                            break;
                    }
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.text,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    height: Platform.OS === 'ios' ? 85 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
                    paddingTop: Platform.OS === 'ios' ? 5 : 0,
                    borderTopWidth: 1,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: Platform.OS === 'ios' ? 0 : 5,
                }
            })}
        >
            <Tab.Screen name="Scanner" component={ScanScreen} options={{
                headerShown: false,
            }} />

            <Tab.Screen name="Générer" component={GenerateScreen} options={{
                headerShown: false
            }} />

            <Tab.Screen name="Historique" component={HistoryScreen} options={{
                headerShown: false
            }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
