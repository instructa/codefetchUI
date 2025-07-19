import { useTheme } from './theme-provider';

export function ModeToggleClient() {
  const { theme, setTheme } = useTheme();
  const next = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
      title={`Switch to ${next} mode`}
      aria-label={`Switch to ${next} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
