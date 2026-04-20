import AuthLayout from "../features/AuthLayout";
import LoginForm from "../features/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout imageCaption="Dress with intention.">
      <LoginForm />
    </AuthLayout>
  );
}
