"use client";

import { useEffect, useState } from "react";
import { getDaysUntilDeadline, isExpired } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DeadlineCountdownProps {
  deadline: string;
}

export default function DeadlineCountdown({
  deadline,
}: DeadlineCountdownProps) {
  const [days, setDays] = useState(getDaysUntilDeadline(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setDays(getDaysUntilDeadline(deadline));
    }, 60000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (isExpired(deadline)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#111827] text-[#94A3B8] text-xs font-medium border border-[#1F2937]">
        Expired
      </span>
    );
  }

  if (days <= 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EF4444]/30 text-[#EF4444] text-xs font-medium border border-[#EF4444]/30 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
        Last {days === 0 ? "day" : `${days} days`}!
      </span>
    );
  }

  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F59E0B]/30 text-[#F59E0B] text-xs font-medium border border-[#F59E0B]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
        Closes in {days} days
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-[#94A3B8]">
      {days === 0
        ? "Due today"
        : days === 1
        ? "1 day left"
        : `${days} days left`}
    </span>
  );
}
