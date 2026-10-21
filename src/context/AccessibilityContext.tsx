import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilityPreferences, FontChoice, FontSizeChoice, LineHeightChoice, LetterSpacingChoice } from '../types';

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
  applyStudentPreferences: (studentPrefs: AccessibilityPreferences) => void;
  resetToDefaults: () => void;
  // Dynamic CSS classes for quick application
  fontClassName: string;
  fontSizeClassName: string;
  letterSpacingClassName: string;
  lineHeightClassName: string;
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  fontChoice: 'legivel',
  fontSize: 'md',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  highContrast: false,
  highlightMainInstruction: true,
  reduceMotion: false,
  enableAudioNarrator: true,
  soundFeedback: true,
  hideSecondaryDetails: false,
  calmPacing: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    try {
      const saved = localStorage.getItem('aura_accessibility_prefs');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_accessibility_prefs', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Could not save accessibility preferences', e);
    }

    // Apply high contrast & motion classes to root document
    const root = document.documentElement;
    if (preferences.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    if (preferences.reduceMotion) {
      root.classList.add('sensory-reduced-motion');
    } else {
      root.classList.remove('sensory-reduced-motion');
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<AccessibilityPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const applyStudentPreferences = (studentPrefs: AccessibilityPreferences) => {
    setPreferences(studentPrefs);
  };

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  // Font family class mapper
  const fontClassName = (() => {
    switch (preferences.fontChoice) {
      case 'cursiva':
        return 'font-cursiva tracking-wide text-blue-950 font-medium';
      case 'bastao':
        return 'font-bastao tracking-wider uppercase font-semibold';
      case 'legivel':
        return 'font-legivel font-normal';
      default:
        return 'font-padrao';
    }
  })();

  // Font size class mapper
  const fontSizeClassName = (() => {
    switch (preferences.fontSize) {
      case 'sm':
        return 'text-sm leading-normal';
      case 'lg':
        return 'text-lg leading-relaxed';
      case 'xl':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-normal';
    }
  })();

  // Spacing mappers
  const letterSpacingClassName = (() => {
    switch (preferences.letterSpacing) {
      case 'wide':
        return 'tracking-wide';
      case 'wider':
        return 'tracking-widest';
      default:
        return 'tracking-normal';
    }
  })();

  const lineHeightClassName = (() => {
    switch (preferences.lineHeight) {
      case 'relaxed':
        return 'leading-relaxed';
      case 'loose':
        return 'leading-loose';
      default:
        return 'leading-normal';
    }
  })();

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        updatePreferences,
        applyStudentPreferences,
        resetToDefaults,
        fontClassName,
        fontSizeClassName,
        letterSpacingClassName,
        lineHeightClassName,
      }}
    >
      <div className={`${fontClassName} ${preferences.reduceMotion ? 'sensory-reduced-motion' : ''}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
