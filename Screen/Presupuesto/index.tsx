import { RefreshControl, ScrollView } from "react-native";
import { useCallback, useState } from "react";
import { List, Surface, Title } from "react-native-paper";
import BudgetsAPI, { ICategory } from "../../API/Budgets";
import { useFocusEffect } from "@react-navigation/native";
import numeral from "numeral";

export default function Presupuesto() {
  const [refresh, setRefresh] = useState(false);
  const [budget, setBudget] = useState([] as ICategory[]);

  useFocusEffect(
    useCallback(() => {
      fetchBudget();
    }, [])
  );

  function onRefresh() {
    fetchBudget();
  }

  function fetchBudget() {
    setRefresh(true);
    BudgetsAPI.Categories()
      .then((value) => {
        value = value.filter((item) => !item.hidden && !item.deleted);

        setBudget(value);
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
      {!!budget.length && (
        <>
          <Surface>
            <Title>{budget[0].categories[1].balance}</Title>
          </Surface>
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
                    description={
                      numeral(subitem.budgeted / 1000).format("$#,#.##") +
                      " / " +
                      numeral(subitem.balance / 1000).format("$#,#.##")
                    }
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
