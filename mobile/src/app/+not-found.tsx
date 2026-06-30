import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Screen not found</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go to Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  code: { fontSize: 72, fontWeight: '800', color: Colors.textMuted },
  title: { ...Typography.subheading, color: Colors.textSecondary },
  link: { marginTop: Spacing.sm },
  linkText: { ...Typography.bodyMedium, color: Colors.primary },
});
