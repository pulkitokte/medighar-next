import { useEffect, useState } from "react";
import {
  Palette,
  Accessibility,
  Bell,
  Languages,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import { useUserPreferences } from "@/hooks/useUserPreferences.js";
import {
  THEME_OPTIONS,
  FONT_SIZE_OPTIONS,
  READING_WIDTH_OPTIONS,
  LANGUAGE_OPTIONS,
  NOTIFICATION_PREFERENCE_KEYS,
  NOTIFICATION_PREFERENCE_LABELS,
} from "@/services/preferences/preferences.service.js";

const OPTION_LABELS = {
  system: "System",
  light: "Light",
  dark: "Dark",
  small: "Small",
  medium: "Medium",
  large: "Large",
  comfortable: "Comfortable",
  wide: "Wide",
  english: "English",
  hindi: "Hindi",
};

function SettingsSection({ title, icon: Icon, children }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function RadioGroup({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-slate-700">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const inputId = `${name}-${option}`;
          const isChecked = value === option;

          return (
            <div key={option}>
              <input
                type="radio"
                id={inputId}
                name={name}
                value={option}
                checked={isChecked}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <label
                htmlFor={inputId}
                className={cn(
                  "inline-flex cursor-pointer items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500",
                  isChecked
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {OPTION_LABELS[option] ?? option}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function ToggleRow({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm font-medium text-slate-900">
          {label}
        </label>
        {description && (
          <span className="text-xs text-slate-500">{description}</span>
        )}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
          checked
            ? "border-blue-600 bg-blue-600"
            : "border-slate-300 bg-slate-200",
        )}
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  const {
    preferences,
    updatePreference,
    updateNotificationPreference,
    resetPreferences,
  } = useUserPreferences();

  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!statusMessage) return undefined;

    const timeout = setTimeout(() => setStatusMessage(""), 2500);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const handleUpdate = (key, value, label) => {
    updatePreference(key, value);
    setStatusMessage(`${label} updated.`);
  };

  const handleNotificationUpdate = (key, value) => {
    updateNotificationPreference(key, value);
    setStatusMessage(
      `${NOTIFICATION_PREFERENCE_LABELS[key]} ${value ? "enabled" : "disabled"}.`,
    );
  };

  const handleReset = () => {
    resetPreferences();
    setStatusMessage("Preferences reset to defaults.");
  };

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Settings"
          subtitle="Customize appearance, accessibility, notifications, and language for Medighar."
          center
        />

        <p role="status" aria-live="polite" className="sr-only">
          {statusMessage}
        </p>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <SettingsSection title="Appearance" icon={Palette}>
            <RadioGroup
              legend="Theme"
              name="theme"
              options={THEME_OPTIONS}
              value={preferences.theme}
              onChange={(value) => handleUpdate("theme", value, "Theme")}
            />
            <RadioGroup
              legend="Font Size"
              name="fontSize"
              options={FONT_SIZE_OPTIONS}
              value={preferences.fontSize}
              onChange={(value) => handleUpdate("fontSize", value, "Font size")}
            />
            <RadioGroup
              legend="Reading Width"
              name="readingWidth"
              options={READING_WIDTH_OPTIONS}
              value={preferences.readingWidth}
              onChange={(value) =>
                handleUpdate("readingWidth", value, "Reading width")
              }
            />
          </SettingsSection>

          <SettingsSection title="Accessibility" icon={Accessibility}>
            <ToggleRow
              id="reduced-motion"
              label="Reduced Motion"
              description="Minimizes transitions and decorative animations."
              checked={preferences.reducedMotion}
              onChange={(value) =>
                handleUpdate("reducedMotion", value, "Reduced motion")
              }
            />
            <ToggleRow
              id="high-contrast"
              label="High Contrast Mode"
              description="Increases visual contrast for text and borders."
              checked={preferences.highContrast}
              onChange={(value) =>
                handleUpdate("highContrast", value, "High contrast mode")
              }
            />
            <ToggleRow
              id="compact-mode"
              label="Compact Mode"
              description="Reduces padding and spacing throughout the app."
              checked={preferences.compactMode}
              onChange={(value) =>
                handleUpdate("compactMode", value, "Compact mode")
              }
            />
          </SettingsSection>

          <SettingsSection title="Notifications" icon={Bell}>
            <div className="flex flex-col gap-3">
              {NOTIFICATION_PREFERENCE_KEYS.map((key) => (
                <ToggleRow
                  key={key}
                  id={`notification-${key}`}
                  label={NOTIFICATION_PREFERENCE_LABELS[key]}
                  checked={preferences.notifications[key]}
                  onChange={(value) => handleNotificationUpdate(key, value)}
                />
              ))}
            </div>
          </SettingsSection>

          <SettingsSection title="Language" icon={Languages}>
            <RadioGroup
              legend="Preferred Language"
              name="language"
              options={LANGUAGE_OPTIONS}
              value={preferences.language}
              onChange={(value) => handleUpdate("language", value, "Language")}
            />
            <p className="text-xs text-slate-500">
              Translation is not yet implemented — this sets up the preference
              for future language support.
            </p>
          </SettingsSection>

          <SettingsSection title="Reset Preferences" icon={RotateCcw}>
            <p className="text-sm text-slate-600">
              Restore all appearance, accessibility, notification, and language
              settings to their defaults.
            </p>
            <div>
              <Button variant="outline" onClick={handleReset}>
                Reset All Preferences
              </Button>
            </div>
          </SettingsSection>
        </div>
      </Container>
    </Section>
  );
}

export default SettingsPage;
