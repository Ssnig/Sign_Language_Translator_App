import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function TranslateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="camera" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="processing" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="result" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
    </Stack>
  );
}
