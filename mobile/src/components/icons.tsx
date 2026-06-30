/**
 * Centralized SVG icon library.
 *
 * All icons accept a `color` prop (defaults to theme text color) and
 * an optional `size` prop (defaults to 20). This makes them trivially
 * recolorable anywhere in the app without duplicate SVG markup.
 *
 * Usage:
 *   import { SettingsIcon, BackIcon } from '@/components/icons';
 *   <SettingsIcon color={Colors.primary} size={18} />
 */

import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Polyline, Rect, Stop } from 'react-native-svg';
import { Colors } from '@/constants/theme';

export interface IconProps {
  color?: string;
  size?: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const BackIcon: React.FC<IconProps> = ({ color = Colors.text, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const HomeIcon: React.FC<IconProps & { filled?: boolean }> = ({
  color = Colors.textSecondary, size = 22, filled = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      stroke={color} strokeWidth={2}
      fill={filled ? `${color}20` : 'none'}
    />
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth={2} />
  </Svg>
);

export const CameraIcon: React.FC<IconProps & { filled?: boolean }> = ({
  color = Colors.textSecondary, size = 22, filled = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color} strokeWidth={2}
      fill={filled ? `${color}20` : 'none'}
    />
    <Circle cx={12} cy={13} r={4} stroke={color} strokeWidth={2} />
  </Svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 8v4l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M3.05 11a9 9 0 1 0 .5-3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M3 4v4h4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── Actions ──────────────────────────────────────────────────────────────────

export const SettingsIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
    <Path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={color} strokeWidth={2}
    />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const CloseIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const CopyIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z" stroke={color} strokeWidth={2} />
    <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1" stroke={color} strokeWidth={2} />
  </Svg>
);

export const ShareIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={18} cy={5}  r={3} stroke={color} strokeWidth={2} />
    <Circle cx={6}  cy={12} r={3} stroke={color} strokeWidth={2} />
    <Circle cx={18} cy={19} r={3} stroke={color} strokeWidth={2} />
    <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth={2} />
  </Svg>
);

export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({
  color = Colors.textSecondary, size = 18, filled = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color} strokeWidth={2}
    />
  </Svg>
);

export const TrashIcon: React.FC<IconProps> = ({ color = Colors.textSecondary, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = ({ color = Colors.accent, size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} fill={color} opacity={0.15} />
    <Polyline points="20 6 9 17 4 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Camera controls ──────────────────────────────────────────────────────────

export const FlashIcon: React.FC<IconProps & { active?: boolean }> = ({
  color, size = 20, active = false,
}) => {
  const stroke = color ?? (active ? Colors.warning : Colors.textSecondary);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke={stroke} strokeWidth={2}
        fill={active ? `${stroke}25` : 'none'}
        strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
};

export const FlipIcon: React.FC<IconProps> = ({ color = Colors.text, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7h-9m0 0l3-3m-3 3l3 3M4 17h9m0 0l-3 3m3-3l-3-3"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

export const MicIcon: React.FC<IconProps & { active?: boolean }> = ({
  color, size = 22, active = false,
}) => {
  const stroke = color ?? (active ? Colors.accent : Colors.textSecondary);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={9} y={2} width={6} height={12} rx={3}
        stroke={stroke} strokeWidth={2}
        fill={active ? `${stroke}25` : 'none'}
      />
      <Path d="M5 10a7 7 0 0 0 14 0" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 19v3" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
};

// ─── Settings icons ───────────────────────────────────────────────────────────

export const MoonIcon: React.FC<IconProps> = ({ color = Colors.primary, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth={2} />
  </Svg>
);

export const VolumeIcon: React.FC<IconProps> = ({ color = Colors.primary, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" stroke={color} strokeWidth={2} />
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ color = Colors.primary, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth={2} />
  </Svg>
);

export const InfoIcon: React.FC<IconProps> = ({ color = Colors.primary, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const PlayIcon: React.FC<IconProps> = ({ color = Colors.text, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M5 3l14 9-14 9V3z" />
  </Svg>
);

export const PauseIcon: React.FC<IconProps> = ({ color = Colors.text, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </Svg>
);

/** App logo — hand sign inside a glowing circle. */
export const AppLogoIcon: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 72 72">
    <Defs>
      <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={Colors.primary} stopOpacity="0.4" />
        <Stop offset="100%" stopColor={Colors.primary} stopOpacity="0.05" />
      </LinearGradient>
    </Defs>
    <Ellipse cx={36} cy={36} rx={36} ry={36} fill="url(#logoGrad)" />
    <Circle cx={36} cy={36} r={28} fill={`${Colors.primary}18`} stroke={Colors.primary} strokeWidth={1.5} />
    <Path d="M26 30c0-2 1.5-3.5 3.5-3.5S33 28 33 30v7" stroke={Colors.text} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M33 28c0-2 1.5-3.5 3.5-3.5S40 26 40 28v7" stroke={Colors.text} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M40 30c0-2 1.5-3.5 3.5-3.5S47 28 47 30v6" stroke={Colors.text} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M26 37v3a8 8 0 0 0 8 8h4a8 8 0 0 0 8-8v-3" stroke={Colors.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/** Avatar placeholder — gradient circle with silhouette. */
export const AvatarIcon: React.FC<{ size?: number }> = ({ size = 88 }) => (
  <Svg width={size} height={size} viewBox="0 0 88 88">
    <Defs>
      <LinearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%"   stopColor={Colors.primary} />
        <Stop offset="100%" stopColor="#7C3AED" />
      </LinearGradient>
    </Defs>
    <Circle cx={44} cy={44} r={44} fill="url(#avatarGrad)" />
    <Circle cx={44} cy={36} r={14} fill="rgba(255,255,255,0.9)" />
    <Path d="M16 72c0-15.46 12.54-28 28-28s28 12.54 28 28" fill="rgba(255,255,255,0.9)" />
  </Svg>
);
