import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default AppRoute = () => {
	const insets = useSafeAreaInsets();

	return (
		<View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
			<BottomTabNavigator />
		</View>
	);
}
