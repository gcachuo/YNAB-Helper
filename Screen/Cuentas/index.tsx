import { RefreshControl, ScrollView } from "react-native";
import { useCallback, useState } from "react";
import { Card, Title } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import numeral from "numeral";

import BudgetsAPI, { IAccounts } from "../../API/Budgets";

export default function Cuentas() {
  const [refresh, setRefresh] = useState(false);
  const [accounts, setAccounts] = useState([] as IAccounts[]);

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );

  function onRefresh() {
    fetchAccounts();
  }

  function fetchAccounts() {
    const budgetId = "bfdc3ba1-6f6e-4c07-a3ed-9e8fd4f2f5e0";
    setRefresh(true);
    BudgetsAPI.Accounts(budgetId)
      .then((value) => {
        value = value.sort((a, b) => {
          return b.balance - a.balance;
        });

        const onBudget = value.filter((account) => {
          return account.on_budget;
        });
        const offBudget = value.filter((account) => {
          return !account.on_budget;
        });

        setAccounts(onBudget);
      })
      .finally(() => {
        setRefresh(false);
      });
  }

  return (
    <ScrollView
      style={{ paddingHorizontal: 20 }}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      {accounts.map((account) => (
        <Card key={account.id} style={{ marginVertical: 10 }}>
          <Card.Title
            title={account.name}
            subtitle={
              {
                checking: "Débito",
                savings: "Ahorro",
                cash: "Efectivo",
                creditCard: "Crédito",
              }[account.type] ?? account.type
            }
          />
          <Card.Content>
            <Title>{numeral(account.balance / 1000).format("$#,#.##")}</Title>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
