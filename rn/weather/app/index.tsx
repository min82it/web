import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import SearchInput from "@/components/SearchInput";
import { fetchLocation, fetchWeather } from "../utils/api";

type Props = {
  onSubmit: (text: string) => void;
};

type State = {
  location: string;
  loading: boolean;
  error: boolean;
  temperature: number;
  weather: string;
};

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      location: "",
      loading: false,
      error: false,
      weather: "",
      temperature: 0,
    };
  }

  componentDidMount(): void {
    this.handleUpdateLocation("Seoul");
  }

  handleUpdateLocation = async (city: string) => {
    if (!city) return;
    this.setState({ loading: true });
    try {
      const locationId = await fetchLocation(city);
      const { location, weather, temperature } = await fetchWeather(locationId);

      this.setState({
        loading: false,
        error: false,
        location,
        weather,
        temperature,
      });
    } catch (e) {
      this.setState({ loading: false, error: true });
    }
  };

  render() {
    const { location, loading, error, temperature, weather } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={require(`../assets/kipchoge.jpg`)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try a different city.
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      {weather}
                    </Text>
                    <Text
                      style={[styles.largeText, styles.textStyle]}
                    >{`${Math.round(temperature)}°`}</Text>
                  </View>
                )}
              </View>
            )}
            <SearchInput
              placeholder="Search any city"
              onSubmit={this.handleUpdateLocation}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34495E",
  },
  imageContainer: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  image: {
    flex: 1,
    borderRadius: 20,
    opacity: 0.7,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: `rgba(0,0,0,0.2)`
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: "center",
    color: "blue",
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-Regular" },
      android: { fontFamily: "Roboto" },
    }),
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  textInput: {
    backgroundColor: "#666",
    color: "white",
    height: 40,
    width: 300,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
});
