import { ScrollView } from "react-native";
import { Button, Surface, TextInput } from "react-native-paper";
import BudgetsAPI, { IAccounts, ICategory } from "../../API/Budgets";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";

export default function NuevoMovimiento() {
  const [transaction, setTransaction] = useState(
    {} as {
      accountId: "";
      categoryId: "";
      payeeId: "";
      amount: 0;
    }
  );
  const [accounts, setAccounts] = useState([] as IAccounts[]);
  const [categories, setCategories] = useState([] as ICategory[]);

  function saveTransaction() {
    BudgetsAPI.Transactions(transaction);
  }

  useEffect(() => {
    BudgetsAPI.Accounts().then((value) => {
      value = value.sort((a, b) =>
        a.on_budget === b.on_budget ? 0 : a.on_budget ? -1 : 1
      );
      setAccounts(value);
    });
    BudgetsAPI.Categories().then((value) => {
      value = value.filter((item) => item.name !== "Credit Card Payments");
      setCategories(value);
    });
  }, []);

  return (
    <ScrollView>
      <Surface style={{ padding: 20 }}>
        <Picker
          selectedValue={transaction.accountId}
          onValueChange={(itemValue, itemIndex) => {
            transaction.accountId = itemValue;
            setTransaction({ ...transaction });
          }}
        >
          {accounts.map((item) => (
            <Picker.Item label={item.name} value={item.id} />
          ))}
        </Picker>
        <Picker
          selectedValue={transaction.categoryId}
          onValueChange={(itemValue, itemIndex) => {
            transaction.categoryId = itemValue;
            setTransaction({ ...transaction });
          }}
        >
          {categories.map((item) =>
            item.categories
              .filter((item) => item.name !== "Uncategorized")
              .map((sub) => (
                <Picker.Item
                  label={`(${item.name}) ${sub.name}`}
                  value={sub.id}
                />
              ))
          )}
        </Picker>
        <TextInput label={"Cantidad"} keyboardType={"numeric"} />
        <Button
          mode={"contained"}
          onPress={() => {
            saveTransaction();
          }}
        >
          Guardar
        </Button>
      </Surface>
    </ScrollView>
  );
}
