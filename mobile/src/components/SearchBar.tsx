import { useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SearchIcon, CloseIcon } from './icons';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Shows a clear (×) button when the input has text. */
  clearable?: boolean;
  /** Focuses the input on mount. */
  autoFocus?: boolean;
  style?: ViewStyle;
}

const SearchIconEl = () => <SearchIcon />;
const ClearIconEl = () => <CloseIcon />;

/**
 * Controlled search input with a leading search icon.
 * Set `clearable` to show a tap-to-clear button when the field has content.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  clearable = true,
  autoFocus = false,
  style,
}) => {
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, style]}>
      <SearchIconEl />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        autoFocus={autoFocus}
        returnKeyType="search"
        style={styles.input}
        accessibilityLabel="Search input"
      />
      {clearable && value.length > 0 && (
        <TouchableOpacity onPress={handleClear} accessibilityLabel="Clear search">
          <ClearIconEl />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: Colors.surface,
    borderRadius:    Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm + 4,
    gap:             Spacing.sm,
    borderWidth:     1,
    borderColor:     Colors.border,
  },
  input: {
    flex:       1,
    ...Typography.body,
    color:      Colors.text,
    padding:    0, // reset Android default padding
  },
});
