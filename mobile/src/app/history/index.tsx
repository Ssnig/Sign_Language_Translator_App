import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { HistoryCard } from '@/components/HistoryCard';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useHistoryStore } from '@/store/history.store';

const EmptyState = () => (
  <Animated.View entering={FadeIn} style={styles.empty}>
    <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
      <Path d="M12 8v4l3 3" stroke={Colors.textMuted} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M3.05 11a9 9 0 1 0 .5-3" stroke={Colors.textMuted} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M3 4v4h4" stroke={Colors.textMuted} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
    <Text style={styles.emptyTitle}>No translations yet</Text>
    <Text style={styles.emptyDesc}>Start translating sign language to see your history here.</Text>
  </Animated.View>
);

const FilterChip: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
    <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { items, removeItem, toggleFavorite, clearAll } = useHistoryStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.englishText.toLowerCase().includes(query.toLowerCase()) ||
      item.myanmarText.includes(query);
    const matchesFilter = filter === 'all' || item.isFavorite;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.root}>
      <Header
        title="History"
        rightAction={
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearBtn}>Clear</Text>
          </TouchableOpacity>
        }
      />

      <Animated.View entering={FadeInDown.springify()} style={styles.controls}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search translations..." />
        <View style={styles.filters}>
          <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="Favorites" active={filter === 'favorites'} onPress={() => setFilter('favorites')} />
        </View>
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: 80 + insets.bottom }]}
        renderItem={({ item, index }) => (
          <HistoryCard
            item={item}
            index={index}
            onFavorite={() => toggleFavorite(item.id)}
            onDelete={() => removeItem(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  controls: { paddingHorizontal: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.sm },
  filters: { flexDirection: 'row', gap: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: `${Colors.primary}20`, borderColor: Colors.primary },
  filterLabel: { ...Typography.caption, color: Colors.textSecondary },
  filterLabelActive: { color: Colors.primary, fontWeight: '600' },
  list: { paddingHorizontal: Spacing.md },
  clearBtn: { ...Typography.caption, color: Colors.error },
  empty: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.md },
  emptyTitle: { ...Typography.subheading, color: Colors.textSecondary },
  emptyDesc: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: Spacing.xl },
});
