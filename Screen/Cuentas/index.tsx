import { RefreshControl, ScrollView } from "react-native";
import { useCallback, useState } from "react";
import { BottomNavigation, Card, Title } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import numeral from "numeral";

import BudgetsAPI, { IAccounts } from "../../API/Budgets";

export default function Cuentas() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "cuentas",
      title: "Cuentas",
      focusedIcon: "wallet",
      unfocusedIcon: "wallet-outline",
    },
    {
      key: "inversiones",
      title: "Inversiones",
      focusedIcon: "chart-line",
      unfocusedIcon: "chart-line",
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    cuentas: () => <AccountList onBudget={true} />,
    inversiones: () => <AccountList onBudget={false} />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

function AccountList(props: { onBudget: boolean }) {
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
    setRefresh(true);
    BudgetsAPI.Accounts()
      .then((value) => {
        value = value.sort((a, b) => {
          return b.balance - a.balance;
        });

        // console.log(value);

        const onBudget = value.filter((account) => {
          return (
            account.on_budget === props.onBudget &&
            !account.closed &&
            !account.deleted
          );
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
                otherAsset: "Otro",
                personalLoan: "Préstamo",
                mortgage: "Hipoteca",
              }[account.type] ?? account.type
            }
          />
          <Card.Content>
            <Title
              style={{ color: account.balance > 0 ? "#009100" : "#d00000" }}
            >
              {numeral(account.balance / 1000).format("$#,#.##")}
            </Title>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
