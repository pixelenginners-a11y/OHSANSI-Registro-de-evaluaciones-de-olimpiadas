// src/routes/construccion.tsx
import { createFileRoute } from "@tanstack/react-router";
import UnderConstruction from "../../components/UnderConstruction";

export const Route = createFileRoute("/shared/construccion")({
  component: UnderConstruction,
});
