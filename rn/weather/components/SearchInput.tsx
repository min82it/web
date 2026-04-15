import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  placeholder: string;
  onSubmit: (text: string) => void;
};

type State = {
  text: string;
};

export default class SearchInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  handleChangeText = (text: string) => {
    this.setState({ text: text });
  };

  handleSubmitEditing = () => {
    const { onSubmit } = this.props;
    const { text } = this.state;
    if (!text) return;
    onSubmit(text);
    this.setState({ text: "" });
  };

  render() {
    const { placeholder = "" } = this.props;
    const { text } = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={text}
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor="white"
          underlineColorAndroid="transparent"
          clearButtonMode="always"
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmitEditing} //notify parent App component when the user submits a new searched value.
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    marginTop: 20,
    backgroundColor: "#666",
    marginHorizontal: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    color: "white",
  },
});
