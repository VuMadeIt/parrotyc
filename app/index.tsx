import { Redirect } from 'expo-router';

/** App entry — always land on the Parrot onboarding stack. */
export default function Index() {
  return <Redirect href="/parrot" />;
}
