# react-native-picker-modal
A React Native Picker that mimics Android's implementation in iOS without changing the original API. It uses React Native's `Picker` on Android and `Text` that shows the `Picker` inside a `Modal` on iOS.

## Install
```sh
npm i react-native-picker-modal --save
// OR
yarn add react-native-picker-modal
```

## Usage
It receives and passes along the same props and children that the [react-native Picker](https://facebook.github.io/react-native/docs/picker.html) receives.

```jsx
import PickerModal from 'react-native-picker-modal';
import { Picker } from 'react-native';

// ...

<PickerModal
  selectedValue={this.state.language}
  onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
  <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
</PickerModal>
```