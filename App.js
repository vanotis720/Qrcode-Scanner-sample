import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppRoute from './src/navigations/AppRoute';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar style="auto" />
			<SafeAreaProvider>
				<AppRoute />
			</SafeAreaProvider>
		</NavigationContainer>
	);
}