import { Platform, View } from "react-native";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import moment from "moment";

export default function DateTimePickerComponent(props: {
  setDate: (date: string) => void;
  maximumDate?: Date;
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    props.setDate(moment(selectedDate).format("YYYY-MM-DD"));
  }, [selectedDate]);

  return (
    <View
      style={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "row",
      }}
    >
      {Platform.OS === "ios" && (
        <RNDateTimePicker
          value={moment().toDate()}
          display={"default"}
          maximumDate={new Date()}
        />
      )}
      {Platform.OS === "android" && (
        <View>
          <Button
            onPress={() => {
              DateTimePickerAndroid.open({
                maximumDate: props.maximumDate,
                value: selectedDate,
                onChange(value) {
                  setSelectedDate(moment(value.nativeEvent.timestamp).toDate());
                },
              });
            }}
          >
            {moment(selectedDate).format("DD/MM/YYYY")}
          </Button>
        </View>
      )}
    </View>
  );
}
