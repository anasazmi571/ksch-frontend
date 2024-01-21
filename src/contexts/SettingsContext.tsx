import { ReactNode, createContext, useCallback, useMemo, useState } from "react";
import { DataStore, Settings } from "../models";
import { JsonDataStore } from "../data/JsonDataStore";

type SettingsFunctions = {
  settings: Settings;
  setSettings: (s: Settings) => Promise<Settings | undefined>;
};

export const SettingsContext = createContext<SettingsFunctions>({
  settings: {
    id: '',
    registrationDeadline: new Date(),
    teamEditDeadline: new Date()
  },
  setSettings: () => new Promise<Settings | undefined>(resolve => resolve(undefined))
});

export function SettingsProvider({
  children
}: {
  children: ReactNode
}) {
  const defaultSettings: Settings = useMemo(() => ({
    id: '0',
    registrationDeadline: new Date(2024, 6, 1),
    teamEditDeadline: new Date(2024, 6, 1)
  }), []);
  const settingsDb: DataStore<Settings> = useMemo(() => new JsonDataStore<Settings>([defaultSettings]), [defaultSettings]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const handleSetSettings = useCallback((v: Settings) => new Promise<Settings | undefined>(resolve => {
    settingsDb.update(settings.id, v).then(result => {
      if (!!result) {
        setSettings(result);
        resolve(result);
      }
    });
  }), [settings, settingsDb]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings: handleSetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}