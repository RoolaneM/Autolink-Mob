import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontSize, FontWeight, Spacing } from '../../../constants/Colors';

export const baseStyles = () =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
      backgroundColor: Colors.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.text,
    },
    email: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.success,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: BorderRadius.md,
      gap: 4,
    },
    buttonText: {
      color: '#FFF',
      fontSize: FontSize.xs,
      fontWeight: FontWeight.bold,
    },
    empty: {
      marginTop: 60,
      alignItems: 'center',
    },
    emptyText: {
      marginTop: 10,
      color: Colors.textSecondary,
    },
  });