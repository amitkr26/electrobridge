"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Profile {
  full_name: string;
  qualification: string;
  specialization: string;
  has_net: boolean;
  has_gate: boolean;
  preferred_location: string;
}

const QUALIFICATIONS = [
  "MSc Electronics",
  "MSc Physics",
  "BTech ECE",
  "BTech EE",
  "MTech VLSI",
  "MTech ECE",
  "PhD",
  "Other",
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    qualification: "",
    specialization: "",
    has_net: false,
    has_gate: false,
    preferred_location: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) {
        router.push("/login");
        return;
      }
      const { data: existing } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (existing) {
        setProfile({
          full_name: existing.full_name || "",
          qualification: existing.qualification || "",
          specialization: existing.specialization || "",
          has_net: existing.has_net || false,
          has_gate: existing.has_gate || false,
          preferred_location: existing.preferred_location || "",
        });
      } else {
        setProfile((p) => ({ ...p, full_name: data.user?.user_metadata?.full_name || "" }));
      }
      setLoading(false);
    });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Profile saved successfully!");
      }
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary flex items-center gap-3">
          <User className="w-8 h-8 text-accent" />
          My Profile
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Update your profile to get better-matched opportunities
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-surface border border-border rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-text-secondary text-xs font-medium mb-1.5">Full Name</label>
          <input
            value={profile.full_name}
            onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
            className="w-full bg-bg-primary border border-border text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">Highest Qualification</label>
            <select
              value={profile.qualification}
              onChange={(e) => setProfile((p) => ({ ...p, qualification: e.target.value }))}
              className="w-full bg-bg-primary border border-border text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            >
              <option value="">Select...</option>
              {QUALIFICATIONS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">Specialization</label>
            <input
              value={profile.specialization}
              onChange={(e) => setProfile((p) => ({ ...p, specialization: e.target.value }))}
              placeholder="thin film, spintronics, VLSI, embedded..."
              className="w-full bg-bg-primary border border-border text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.has_net}
              onChange={(e) => setProfile((p) => ({ ...p, has_net: e.target.checked }))}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-text-primary text-sm">NET Qualified</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.has_gate}
              onChange={(e) => setProfile((p) => ({ ...p, has_gate: e.target.checked }))}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-text-primary text-sm">GATE Qualified</span>
          </label>
        </div>

        <div>
          <label className="block text-text-secondary text-xs font-medium mb-1.5">Preferred Location</label>
          <input
            value={profile.preferred_location}
            onChange={(e) => setProfile((p) => ({ ...p, preferred_location: e.target.value }))}
            placeholder="Delhi, Bangalore, Hyderabad, International..."
            className="w-full bg-bg-primary border border-border text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-accent text-bg-primary font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-accent-hover transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
