import { RefreshControl, ScrollView } from "react-native";
import { DataTable, Title } from "react-native-paper";
import FABComponent from "../../Components/FABComponent";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import numeral from "numeral";
import BudgetsAPI, { IMonth } from "../../API/Budgets";
import moment from "moment";

export default function Pendientes() {
  const [pending, setPending] = useState(
    [] as {
      date?: string;
      categoryId: string;
      accountId: string;
      key: string;
      amount?: number;
    }[]
  );
  const [refresh, setRefresh] = useState(false);
  const [current, setCurrent] = useState({} as IMonth);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
      BudgetsAPI.Months(false).then((value) => {
        setCurrent(value);
      });
    }, [])
  );

  function onRefresh() {
    (async () => {
      const key = "@pending-transactions";
      let pendingTransactions: {
        date?: string;
        categoryId: string;
        accountId: string;
        key: string;
        amount?: number;
      }[] = JSON.parse((await AsyncStorage.getItem(key)) || "[]");
      setPending(pendingTransactions);
    })();
  }

  let total = current.to_be_budgeted;
  return (
    <>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <Title style={{ marginVertical: 20 }}>
          {numeral(current.to_be_budgeted / 1000).format("$#,#.##")}
        </Title>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Fecha</DataTable.Title>
            <DataTable.Title>Beneficiario</DataTable.Title>
            <DataTable.Title>Cantidad</DataTable.Title>
            <DataTable.Title>Restante</DataTable.Title>
          </DataTable.Header>

          {pending
            .sort((a, b) => +moment(a.date) - +moment(b.date))
            .map(
              (transaction: {
                date?: string;
                categoryId: string;
                accountId: string;
                key: string;
                amount?: number;
                payeeName?: string;
              }) => {
                total += transaction.amount || 0;
                return (
                  <DataTable.Row key={transaction.key}>
                    <DataTable.Cell>
                      {moment(transaction.date).format("DD/MM/YYYY")}
                    </DataTable.Cell>
                    <DataTable.Cell>{transaction.payeeName}</DataTable.Cell>
                    <DataTable.Cell>
                      {transaction.amount &&
                        numeral(transaction.amount / 1000).format("$#,#.##")}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {numeral(total / 1000).format("$#,#.##")}
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              }
            )}
        </DataTable>
      </ScrollView>
      <FABComponent pending={true} />
    </>
  );
}
