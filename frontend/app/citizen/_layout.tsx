import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../hooks/useAuthStore';

export default function CitizenLayout() {
  const user = useAuthStore(s => s.user);
  if (!user || user.role !== 'qytetar') return <Redirect href="/login" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="track" />
    </Stack>
  );
}
