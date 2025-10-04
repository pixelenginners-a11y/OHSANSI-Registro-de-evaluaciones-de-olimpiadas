// src/features/login/pages/loginPage.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { PageTitle } from "../components/PageTitle";
import { LoginPanel } from "../components/LoginPanel";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const canSubmit = email.trim().length > 3 && pwd.trim().length > 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    try {
      await login({ email, password: pwd });
      navigate({ to: "/app", replace: true });
    } catch {
      // Error manejado por el hook
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
      <Header />
      <PageTitle />
      <LoginPanel
        email={email}
        password={pwd}
        loading={loading}
        canSubmit={canSubmit}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPwd}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
