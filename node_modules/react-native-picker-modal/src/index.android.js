import React from "react";
import { Picker } from "react-native";

const PickerModal = props => {
  return <Picker {...props}>{props.children}</Picker>;
};

export default PickerModal;
