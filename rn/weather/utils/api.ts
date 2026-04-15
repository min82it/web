export async function fetchLocation(city: string): Promise<string> {
  const response = await fetch(`apiurl?city=${city}`);
  const data = response.json();
  return data.locationId;
}

export const fetchWeather = async (
  locationId: string,
): Promise<{
  location: string;
  weather: string;
  temperature: number;
}> => {
  const response = await fetch(`apiurl/${locationId}`);
  const data = response.json();
  return {
    location: data.location,
    weather: data.weather,
    temperature: data.temperature,
  };
};
