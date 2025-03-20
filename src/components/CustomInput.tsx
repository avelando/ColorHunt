import React from "react";
import { TextInput, View, Text } from "react-native";
import { CustomInputProps } from "../interfaces/CustomInputProps";

const CustomInput: React.FC<CustomInputProps> = ({ label, ...props }) => {
  return (
    <View style={{ width: "100%", marginVertical: 10 }}>
      <Text style={{ fontSize: 14, marginBottom: 5, color: "#333" }}>{label}</Text>
      <TextInput
        style={{
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          backgroundColor: "#fff",
        }}
        {...props}
      />
    </View>
  );
};

export default CustomInput;
