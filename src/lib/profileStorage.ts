import type { UserProfile } from "../types";

const STORAGE_KEY = "interntrack_profile";

const defaultProfile: UserProfile = {
  name: "Ananya",
  email: "ananya@example.com",
  role: "Frontend Developer Intern",
  location: "India",
};

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const savedProfile = localStorage.getItem(STORAGE_KEY);

  if (!savedProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  try {
    return JSON.parse(savedProfile) as UserProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}