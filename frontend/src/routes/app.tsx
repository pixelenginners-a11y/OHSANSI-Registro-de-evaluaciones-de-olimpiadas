// src/routes/app.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[var(--color-primary-dark)]">
        Bienvenido 👋
      </h2>
    </div>
  ),
});
