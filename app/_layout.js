import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="(tabs)" /> */}
      <Stack.Screen name="userType" />
      <Stack.Screen name="DriverData" />
      <Stack.Screen name="OTP_Screen" />
      {/* <Stack.Screen name="passenger" /> */}
      {/* <Stack.Screen name="driver" /> */}
      <Stack.Screen name="driverTabs" />
    </Stack>
  );
}
