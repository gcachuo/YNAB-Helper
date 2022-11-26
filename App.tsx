import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import useAxiosInterceptors from "./Hooks/useAxiosInterceptors";
import Cuentas from "./Screen/Cuentas";
import Presupuesto from "./Screen/Presupuesto";

const Drawer = createDrawerNavigator();

export default function App() {
  useAxiosInterceptors();

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Cuentas" component={Cuentas} />
        <Drawer.Screen name="Presupuesto" component={Presupuesto} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
