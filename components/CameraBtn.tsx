import {StyleSheet, Text, TouchableOpacity } from "react-native";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function CameraBtn( {icon,color,title, onPress}:any ) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <FontAwesome6 name={icon} size={24} color={color} />
            {title? <Text style={styles.text}>{title}</Text>:null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button:{
        height:50,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
        backgroundColor:"transparent",
        
    },
    text:{
        fontWeight:"bold",
        color:"white",
        fontSize:16,
    }
});