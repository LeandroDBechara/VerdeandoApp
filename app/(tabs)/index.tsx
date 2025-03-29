import { styles } from "@/constants/styles";
import { StatusBar, Text, View } from "react-native";

export default function Home() {
    return (
        
        <View>
            <StatusBar translucent={true} backgroundColor={"green"} barStyle="default" />   
            <Text>Home</Text>
        </View>
    );
}