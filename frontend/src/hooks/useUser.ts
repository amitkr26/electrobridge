"use client";

export function useUser() {
  return {
    user: null,
    username: "guest",
    displayName: "Guest User",
    role: "candidate" as const,
    globalRole: "user" as const,
    permissions: [] as string[],
    isCandidate: true,
    isEmployer: false,
    isAdmin: false,
    hasEmployerCapability: false,
    hasManagerCapability: false,
    loading: false,
    signOut: async () => {},
  };
}
