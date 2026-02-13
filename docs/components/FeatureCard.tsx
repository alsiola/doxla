import { useDoxla, cn } from "doxla";

interface FeatureCardProps {
  title: string;
  children: React.ReactNode;
}

export default function FeatureCard({ title, children }: FeatureCardProps) {
  const { theme } = useDoxla();
  return (
    <div
      className={cn(
        "mb-4 rounded-lg border p-6",
        theme === "dark"
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-gray-50"
      )}
    >
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
