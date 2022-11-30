import { RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { useCallback, useState } from "react";
import numeral from "numeral";
import creditCardsJSON from "../../creditcards.env.json";

import BudgetsAPI, { IAccounts } from "../../API/Budgets";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FABComponent from "../../Components/FABComponent";
import useAxiosInterceptors from "../../Hooks/useAxiosInterceptors";
import { BottomNavigation, Card, Paragraph, Title } from "react-native-paper";
import { DrawerNavigationProp } from "@react-navigation/drawer";

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

function AccountList(props: {
  onBudget: boolean;
  route?: { params?: { cache?: boolean } };
}) {
  const [refresh, setRefresh] = useState(false);
  const [accounts, setAccounts] = useState([] as IAccounts[]);
  const [creditCards, setCreditCards] = useState(
    {} as { [index: string]: { limit: number; name: string } }
  );
  const navigation = useNavigation() as DrawerNavigationProp<any>;
  useAxiosInterceptors();

  useFocusEffect(
    useCallback(() => {
      // console.log(props.route?.params?.cache)
      fetchAccounts(props.route?.params?.cache);
      setCreditCards(creditCardsJSON);
    }, [])
  );

  const onRefresh = useCallback(() => {
    fetchAccounts(false);
  }, []);

  function fetchAccounts(cache: boolean = true) {
    setRefresh(true);
    BudgetsAPI.Accounts(cache)
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
    <SafeAreaView>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        {accounts.map((account) => {
          const accountType =
            {
              checking: "Débito",
              savings: "Ahorro",
              cash: "Efectivo",
              creditCard: "Crédito",
              otherAsset: "Otro",
              personalLoan: "Préstamo",
              mortgage: "Hipoteca",
            }[account.type] ?? account.type;
          const balance = account.balance / 1000;

          return (
            <Card
              key={account.id}
              style={{ marginVertical: 10 }}
              onPress={() => {
                navigation.navigate("NuevoMovimiento", {
                  accountId: account.id,
                });
              }}
            >
              <Card.Title title={account.name} subtitle={accountType} />
              <Card.Content>
                <Title
                  style={{
                    color: account.balance > 0 ? "#009100" : "#d00000",
                  }}
                >
                  {numeral(balance).format("$#,#.##")}
                </Title>
                {account.type === "creditCard" && (
                  <>
                    <Paragraph>
                      {numeral(creditCards[account.id].limit + balance).format(
                        "$#,#.##"
                      )}
                    </Paragraph>
                  </>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>
      <FABComponent />
    </SafeAreaView>
  );
}
