import { Platform, View } from "react-native";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Button } from "react-native-paper";
import moment from "moment";

export default function DateTimePickerComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View
      style={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "row",
      }}
    >
      {Platform.OS === "ios" && (
        <RNDateTimePicker value={moment().toDate()} display={"default"} />
      )}
      {Platform.OS === "android" && (
        <View>
          <Button
            onPress={() => {
              DateTimePickerAndroid.open({
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
