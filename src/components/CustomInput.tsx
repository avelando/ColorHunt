import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { CustomInputProps } from "../interfaces/CustomInputProps";

const CustomInput: React.FC<CustomInputProps> = ({ label, ...props }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={styles.input}
        placeholderTextColor="rgba(255, 255, 255, 0.84)"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#fff",
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    fontSize: 16,
    color: "#fff",
  },
});

export default CustomInput;
