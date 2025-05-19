
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    return (
        <View>
                <StatusBar  backgroundColor={"black"} style="light" />   
            <Text>Home</Text>
        </View>
    );
}