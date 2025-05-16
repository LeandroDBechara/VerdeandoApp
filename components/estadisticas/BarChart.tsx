import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart, Bar } from "victory-native";


const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listeCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));
export default function BarChart() {
  const data = DATA(5);
  const font = useFont("Arial", 12);
  return (
    <View style={{  height:"100%", width: "95%" }}>
      <CartesianChart data={data} xKey="month" yKeys={["listeCount"]} padding={5} domain={{ y: [0, 100] }} domainPadding={{ left: 50, right: 50, top: 30 }} axisOptions={{font ,tickCount: 5,labelColor:"black",lineColor:"black",formatXLabel: (value) => {const date = new Date(2024, value - 1, ); 
      return date.toLocaleString("default", { month: "long" })}}}>
        {({ points, chartBounds }) => (
          <Bar points={points.listeCount} chartBounds={chartBounds} animate={{type: "timing", duration: 1000}} color="red" roundedCorners={{ topLeft: 10, topRight: 10 }} > 
          <LinearGradient
            start={ vec(0,0) }
            end={ vec(0,400) }
            colors={["lightgreen", "green"]}
          />
          </Bar>
        )}
      </CartesianChart>
    </View>
  );
}
