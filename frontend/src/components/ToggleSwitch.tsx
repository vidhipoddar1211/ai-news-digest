interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

export function ToggleSwitch({ enabled, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex h-7 w-14 items-center rounded-full transition-colors
        ${enabled ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-700'}
      `}
      aria-label={label}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform
          ${enabled ? 'translate-x-8' : 'translate-x-1'}
        `}
      />
    </button>
  );
}
