import { ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import FABComponent from "../../Components/FABComponent";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Pendientes() {
  const [pending, setPending] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const key = "@pending-transactions";
        let pendingTransactions: {}[] = JSON.parse(
          (await AsyncStorage.getItem(key)) || "[]"
        );
        console.log(pendingTransactions);
      })();
    }, [])
  );

  return (
    <>
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Fecha</DataTable.Title>
            <DataTable.Title>Beneficiario</DataTable.Title>
            <DataTable.Title>Cantidad</DataTable.Title>
            <DataTable.Title>Cuenta</DataTable.Title>
            <DataTable.Title>Categoria</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>2022-01-01</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </ScrollView>
      <FABComponent pending={true} />
    </>
  );
}
