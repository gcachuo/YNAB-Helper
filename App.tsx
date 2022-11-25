import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import Cuentas from "./Screen/Cuentas";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Cuentas" component={Cuentas} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
