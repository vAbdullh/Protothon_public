// components/StatusBadge.jsx
import React from "react";
import { Badge } from "@/components/shadcn/badge";
import { CheckCircle, XCircle, Clock, Info } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StatusBadge({ status }) {
  const label = useTranslations("shared")(status);

  const colorClasses =
    status === "approved"
      ? "bg-green-200 text-green-900"
      : status === "rejected"
      ? "bg-red-200 text-red-900"
      : status === "pending"
      ? "bg-yellow-200 text-yellow-900 ring-1"
      : "bg-gray-200 text-gray-900";

  const Icon =
    status === "approved"
      ? CheckCircle
      : status === "rejected"
      ? XCircle
      : status === "pending"
      ? Clock
      : Info;

  return (
    <Badge
      className={`inline-flex items-center gap-2 px-3 py-1 font-semibold ${colorClasses}`}
      title={label}
      aria-label={`status: ${label}`}
    >
      <Icon className="size-6" />
      <span className="capitalize">{label}</span>
    </Badge>
  );
}
