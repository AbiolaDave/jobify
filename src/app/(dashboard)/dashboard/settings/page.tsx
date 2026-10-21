"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSeekerSettings, updateSeekerSettings } from "@/services/api";
import type { SeekerSettings } from "@/types/platform";

const defaultSettings: SeekerSettings = {
  jobAlerts: true,
  applicationUpdates: true,
  marketingEmails: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    getSeekerSettings()
      .then((result) => {
        if (isMounted) setSettings(result);
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn’t load your settings.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await updateSeekerSettings(settings);
      setSettings(saved);
      setMessage("Your preferences were saved in this preview.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "We couldn’t save your settings. Try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="page-shell dashboard-content">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Your preferences</p>
          <h1 className="section-heading">Settings</h1>
          <p className="muted-copy">
            Choose which Jobify updates you’d like to receive.
          </p>
        </div>
      </div>
      {isLoading ? (
        <div aria-busy="true" className="skeleton" />
      ) : (
        <form className="settings-form" onSubmit={saveSettings}>
          <label className="settings-option">
            <span>
              <strong>Job alerts</strong>
              <small>Hear about opportunities that match your interests.</small>
            </span>
            <input
              checked={settings.jobAlerts}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  jobAlerts: event.target.checked,
                }))
              }
              type="checkbox"
            />
          </label>
          <label className="settings-option">
            <span>
              <strong>Application updates</strong>
              <small>Get notified when an employer views or updates an application.</small>
            </span>
            <input
              checked={settings.applicationUpdates}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  applicationUpdates: event.target.checked,
                }))
              }
              type="checkbox"
            />
          </label>
          <label className="settings-option">
            <span>
              <strong>Product news and tips</strong>
              <small>Optional updates about Jobify and finding work.</small>
            </span>
            <input
              checked={settings.marketingEmails}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  marketingEmails: event.target.checked,
                }))
              }
              type="checkbox"
            />
          </label>
          {error && (
            <p className="auth-message auth-message--error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p aria-live="polite" className="auth-message" role="status">
              {message}
            </p>
          )}
          <button className="button-primary" disabled={isSaving} type="submit">
            {isSaving ? "Saving…" : "Save preferences"}
          </button>
        </form>
      )}
    </main>
  );
}
