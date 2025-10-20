import { Form } from "../components/Form";
import { LoginLayout } from "../components/LoginLayout";
import { Title } from "../components/Title";

export default function LoginPage() {
  return (
    <div className="min-h-screen min-w-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
      <Title />
      <LoginLayout>
        <Form/>
      </LoginLayout>
    </div>
  );
}
