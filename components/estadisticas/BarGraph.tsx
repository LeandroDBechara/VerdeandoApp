import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
        
export default function BarGraph() {
    const barData = [
        {value: 250, label: 'Lunes'},
        {value: 500, label: 'Martes'},
        {value: 745, label: 'Miercoles'},
        {value: 320, label: 'Jueves'},
        {value: 600, label: 'Viernes'},
        {value: 256, label: 'Sabado'},
        {value: 300, label: 'Domingo'},
    ];
    return (
        <View>
            <BarChart
                noOfSections={3}
                
                frontColor="#90D26D"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                adjustToWidth={true}
            />
        </View>
    );
};