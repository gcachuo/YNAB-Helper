import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import Cuentas from "./Screen/Cuentas";
import useAxiosInterceptors from "./Hooks/useAxiosInterceptors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Drawer = createDrawerNavigator();
const TopTab = createMaterialTopTabNavigator();

export default function App() {
  useAxiosInterceptors();

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="TopTabNavigator" component={TopTabNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


function TopTabNavigator() {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name="Cuentas" component={Cuentas} />
        </TopTab.Navigator>
    );
}

