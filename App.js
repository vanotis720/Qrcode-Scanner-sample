import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppRoute from './src/navigations/AppRoute';

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar style="auto" />
			<AppRoute />
		</NavigationContainer>
	);
}