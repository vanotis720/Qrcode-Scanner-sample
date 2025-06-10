import { NavigationContainer } from '@react-navigation/native';
import AppRoute from './src/navigations/AppRoute';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<AppRoute />
			</SafeAreaProvider>
		</NavigationContainer>
	);
}