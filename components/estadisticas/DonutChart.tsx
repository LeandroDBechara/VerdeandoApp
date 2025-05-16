import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { View } from "react-native";
import { Pie, PolarChart} from "victory-native";

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listeCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    color: `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`,
  }));
export default function DonutChart() {
  const data = DATA(5);
  const font = useFont("Arial", 12);
  return (
    <View style={{ height: "90%", width: "95%" }}>
      <PolarChart
        data={data}
        labelKey={"month"} 
        valueKey={"listeCount"} 
        colorKey={"color"}
        containerStyle={{backgroundColor: "transparent"}}
      >
        <Pie.Chart innerRadius={50}> 
        {({ slice }) => {
          return (
            <Pie.Slice>
            <Pie.Label text="hola" font={font} />
          </Pie.Slice>
          )
        }}
        </Pie.Chart>
      </PolarChart>
    </View>
  );
}

