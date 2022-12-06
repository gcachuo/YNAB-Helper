import * as React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export default function FABComponent(props: { pending?: boolean }) {
  const navigation = useNavigation() as DrawerNavigationProp<any>;
  return (
    <FAB
      icon="plus"
      style={styles.fab}
      onPress={() =>
        navigation.navigate("NuevoMovimiento", { pending: props.pending })
      }
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
