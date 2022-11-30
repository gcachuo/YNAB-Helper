import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import useAxiosInterceptors from "./Hooks/useAxiosInterceptors";
import Cuentas from "./Screen/Cuentas";
import Presupuesto from "./Screen/Presupuesto";
import Movimientos from "./Screen/Movimientos";
import NuevoMovimiento from "./Screen/Movimientos/NuevoMovimiento";
import "moment/locale/es-mx";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  useAxiosInterceptors();

  return <NavContainer />;
}

function NavContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={"DrawerNavigator"}
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={"NuevoMovimiento"}
          component={NuevoMovimiento}
          options={{ title: "Nuevo Movimiento" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Cuentas" component={Cuentas} />
      <Drawer.Screen name="Presupuesto" component={Presupuesto} />
      <Drawer.Screen name="Movimientos" component={Movimientos} />
    </Drawer.Navigator>
  );
}
