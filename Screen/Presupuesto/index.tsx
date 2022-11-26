import { RefreshControl, ScrollView } from "react-native";
import { useCallback, useState } from "react";
import { List, Surface, Title } from "react-native-paper";
import BudgetsAPI, { ICategory, IMonth } from "../../API/Budgets";
import { useFocusEffect } from "@react-navigation/native";
import numeral from "numeral";

export default function Presupuesto() {
  const [refresh, setRefresh] = useState(false);
  const [budget, setBudget] = useState([] as ICategory[]);
  const [month, setMonth] = useState({} as IMonth);

  useFocusEffect(
    useCallback(() => {
      setRefresh(true);
      fetchBudget();
      fetchCash();
    }, [])
  );

  function onRefresh() {
    setRefresh(true);
    fetchBudget();
    fetchCash();
  }

  function fetchBudget() {
    BudgetsAPI.Categories()
      .then((value) => {
        value = value.filter((item) => !item.hidden && !item.deleted);

        setBudget(value);
      })
      .finally(() => {
        setRefresh(false);
      });
  }

  function fetchCash() {
    BudgetsAPI.Months()
      .then((value) => {
        setMonth(value);
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
      <Surface
        style={{
          padding: 20,
          justifyContent: "center",
          flexDirection: "row",
        }}
        elevation={1}
      >
        <Title> {numeral(month.to_be_budgeted / 1000).format("$#,#.##")}</Title>
      </Surface>
      {!!budget.length && (
        <>
          {budget
            .filter(
              (item) =>
                item.name !== "Internal Master Category" &&
                item.name !== "Hidden Categories"
            )
            .map((item) => (
              <List.Accordion title={item.name} key={item.id}>
                {item.categories.map((subitem) => (
                  <List.Item
                    title={subitem.name}
                    description={`${numeral(subitem.balance / 1000).format(
                      "$#,#.##"
                    )} (${numeral(subitem.budgeted / 1000).format(
                      "$#,#.##"
                    )} || ${numeral(subitem.activity / 1000).format(
                      "$#,#.##"
                    )})`}
                    key={subitem.id}
                  />
                ))}
              </List.Accordion>
            ))}
        </>
      )}
    </ScrollView>
  );
}
