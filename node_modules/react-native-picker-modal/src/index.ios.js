import React from "react";
import { Modal, Picker, StyleSheet, Text, TouchableHighlight, View } from "react-native";

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    paddingLeft: 5
  }
});

class PickerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.bindings = {
      togglePicker: this.togglePicker.bind(this),
      closePicker: this.closePicker.bind(this),
      onValueChange: this.onValueChange.bind(this)
    };
  }

  togglePicker() {
    this.setState(state => {
      state.open = !state.open;
      return state;
    });
  }

  closePicker() {
    this.setState(state => {
      state.open = false;
      return state;
    });
  }

  onValueChange() {
    this.props.onValueChange(...arguments);
    this.closePicker();
  }

  getSelectedItem() {
    const childrenArray = React.Children.toArray(this.props.children);
    let selected = childrenArray.find(child => child.props.value === this.props.selectedValue);
    
    if (selected) {
      return selected;
    }

    return childrenArray[0];
  }

  render() {
    const props = Object.assign({}, this.props);
    delete props.style;
    delete props.children;
    delete props.onValueChange;
    
    const picker = (
      <Modal
        style={styles.modal}
        visible={this.state.open}
        onRequestClose={this.bindings.togglePicker}
      >
        <Picker {...props} onValueChange={this.bindings.onValueChange}>{this.props.children}</Picker>
      </Modal>
    );

    return (
      <View>
        <TouchableHighlight style={[styles.textContainer, this.props.style]} onPress={this.bindings.togglePicker}>
          <Text style={styles.text}>{this.getSelectedItem().props.label}</Text>
        </TouchableHighlight>
        {picker}
      </View>
    );
  }
}

export default PickerModal;
