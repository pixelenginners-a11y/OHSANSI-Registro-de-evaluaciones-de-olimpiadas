// src/features/login/pages/loginPage.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { PageTitle } from "../components/PageTitle";
import { LoginPanel } from "../components/LoginPanel";
import { useLogin } from "../hooks/useLogin";
import { useGetMe } from "../hooks/useGetMe";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAsync, loading, error } = useLogin();
  const { refetch: fetchMe } = useGetMe();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const canSubmit = email.trim().length > 3 && pwd.trim().length > 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    try {
      await loginAsync({ email, password: pwd });
      const { data } = await fetchMe();
      const userRole = data?.data.role_id;

      if (userRole === 1) {
        navigate({ to: "/admin", replace: true });
      } else {
        // Otros roles van a página en construcción
        navigate({ to: "/construccion", replace: true });
      }
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
