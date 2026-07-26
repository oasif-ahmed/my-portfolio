'use client';
import { useTheme } from 'next-themes';
import ClickSpark from './ClickSpark';

const themeColors: Record<string, string> = {
  light: '#171717',
  dark: '#f0f0f0',
  cream: '#3a322c',
};

export function ClickSparkProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const sparkColor = themeColors[resolvedTheme || 'dark'] || '#f0f0f0';

  return (
    <ClickSpark sparkColor={sparkColor} sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
      {children}
    </ClickSpark>
  );
}
