import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Surface, TextInput, Title } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-root-toast";
import uuid from "react-native-uuid";

import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import BudgetsAPI, { IAccounts, ICategory } from "../../API/Budgets";
import DateTimePickerComponent from "../../Components/DateTimePickerComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NuevoMovimiento(props: {
  route?: { params?: { accountId?: string; pending?: boolean } };
}) {
  const [transaction, setTransaction] = useState({
    accountId: props.route?.params?.accountId,
  } as {
    accountId: string;
    categoryId: string;
    payeeId: string;
    payeeName: string;
    amount: number;
  });
  const [accounts, setAccounts] = useState([] as IAccounts[]);
  const [categories, setCategories] = useState([] as ICategory[]);
  const navigation = useNavigation() as DrawerNavigationProp<any>;
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("minus");
  const [selectedDate, setSelectedDate] = useState("");

  async function saveTransaction() {
    setLoading(true);

    if (!transaction.payeeName) {
      Toast.show("Ingrese beneficiario");
      setLoading(false);
      return;
    }

    if (!transaction.amount) {
      Toast.show("Ingrese cantidad");
      setLoading(false);
      return;
    }

    const newTransaction = {
      date: selectedDate,
      accountId: transaction.accountId,
      amount: transaction.amount
        ? Math.trunc(transaction.amount * 1000)
        : transaction.amount,
      categoryId: transaction.categoryId,
      payeeId: transaction.payeeId,
      payeeName: transaction.payeeName,
    };

    if (props.route?.params?.pending) {
      const key = "@pending-transactions";
      let pendingTransactions: {}[] = JSON.parse(
        (await AsyncStorage.getItem(key)) || "[]"
      );
      pendingTransactions = [
        { key: uuid.v4(), ...newTransaction },
        ...pendingTransactions,
      ];
      AsyncStorage.setItem(key, JSON.stringify(pendingTransactions))
        .then((result) => {
          navigation.goBack();
        })
        .catch((error) => {
          console.error(error);
          Toast.show(error.response.data.error.detail);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      BudgetsAPI.Transactions(newTransaction)
        .then((result) => {
          navigation.goBack();
        })
        .catch((error) => {
          Toast.show(error.response.data.error.detail);
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
    <ScrollView style={{ padding: 20 }}>
      <Surface style={{ padding: 20, backgroundColor: "white" }}>
        <View style={{ marginBottom: 20 }}>
          <Title>Fecha</Title>
          <DateTimePickerComponent
            setDate={setSelectedDate}
            maximumDate={props.route?.params?.pending ? undefined : new Date()}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            mode={"outlined"}
            label={"Beneficiario"}
            value={transaction.payeeName}
            onChangeText={(text) => {
              transaction.payeeName = text;
              setTransaction({ ...transaction });
            }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <Button
              textColor={type == "minus" ? "white" : "red"}
              buttonColor={type == "minus" ? "red" : ""}
              mode={type == "minus" ? "contained" : "text"}
              onPress={() => {
                transaction.amount = !isNaN(+transaction.amount)
                  ? Math.abs(transaction.amount) * -1
                  : 0;
                setType("minus");
              }}
            >
              Gasto
            </Button>
            <Button
              textColor={type == "plus" ? "white" : "green"}
              buttonColor={type == "plus" ? "green" : ""}
              mode={type == "plus" ? "contained" : "text"}
              onPress={() => {
                transaction.amount = !isNaN(+transaction.amount)
                  ? Math.abs(transaction.amount)
                  : 0;
                setType("plus");
              }}
            >
              Ingreso
            </Button>
          </View>
          <TextInput
            mode={"outlined"}
            label={"Cantidad"}
            keyboardType={"numeric"}
            value={transaction.amount?.toString()}
            onChangeText={(text) => {
              // @ts-ignore
              transaction.amount = text;
              if (text.substring(text.length - 1) !== ".") {
                transaction.amount =
                  text && !isNaN(+text)
                    ? type === "plus"
                      ? Math.abs(+text)
                      : -Math.abs(+text)
                    : 0;
              }
              setTransaction({ ...transaction });
            }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Title>Cuenta</Title>
          <Picker
            mode={"dialog"}
            selectedValue={transaction.accountId}
            onValueChange={(itemValue, itemIndex) => {
              transaction.accountId = itemValue;
              setTransaction({ ...transaction });
            }}
          >
            {accounts.map((item) => (
              <Picker.Item label={item.name} value={item.id} key={item.id} />
            ))}
          </Picker>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Title>Categoria</Title>
          <Picker
            mode={"dialog"}
            selectedValue={transaction.categoryId}
            onValueChange={(itemValue, itemIndex) => {
              transaction.categoryId = itemValue;
              setTransaction({ ...transaction });
            }}
          >
            {categories.map((item) =>
              item.categories
                .filter((item) => item.name !== "Uncategorized")
                .map((sub) => {
                  let label = sub.name;

                  if (item.name !== "Internal Master Category") {
                    label = `(${item.name}) ${label}`;
                  }

                  return (
                    <Picker.Item label={label} value={sub.id} key={item.id} />
                  );
                })
            )}
          </Picker>
        </View>
        <Button
          loading={loading}
          disabled={loading}
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
