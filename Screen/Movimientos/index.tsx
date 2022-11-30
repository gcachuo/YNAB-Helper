import { RefreshControl, ScrollView } from "react-native";
import { useCallback, useEffect, useState } from "react";
import BudgetsAPI, { ITransaction } from "../../API/Budgets";
import { Card, Paragraph } from "react-native-paper";
import moment from "moment";
import numeral from "numeral";
import FABComponent from "../../Components/FABComponent";

export default function Movimientos() {
  const [refresh, setRefresh] = useState(false);
  const [transactions, setTransactions] = useState([] as ITransaction[]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = useCallback(() => {
    fetchTransactions(false);
  }, []);

  function fetchTransactions(cache: boolean = true) {
    setRefresh(true);
    BudgetsAPI.Transactions(undefined, cache).then((result) => {
      setTransactions(result.sort((a, b) => +moment(b.date) - +moment(a.date)));
      setRefresh(false);
    });
  }

  return (
    <>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        {transactions
          .filter((transaction) => !transaction.transfer_account_id)
          .map((transaction) => {
            return (
              <Card key={transaction.id} style={{ marginVertical: 10 }}>
                <Card.Title
                  title={moment(transaction.date).format("dddd DD/MMM/YYYY")}
                ></Card.Title>
                <Card.Content>
                  {transaction.payee_name && (
                    <Paragraph>{transaction.payee_name}</Paragraph>
                  )}
                  <Paragraph>{transaction.account_name}</Paragraph>
                  <Paragraph>{transaction.category_name}</Paragraph>
                  <Paragraph>
                    {numeral(transaction.amount / 1000).format("$#,#.##")}
                  </Paragraph>
                </Card.Content>
              </Card>
            );
          })}
      </ScrollView>
      <FABComponent />
    </>
  );
}
