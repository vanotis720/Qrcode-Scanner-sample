import { StyleSheet } from "react-native";

export const shadows = StyleSheet.create({
    card: {
        elevation: 1,
        // iOS shadow
        shadowColor: "#131200",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});