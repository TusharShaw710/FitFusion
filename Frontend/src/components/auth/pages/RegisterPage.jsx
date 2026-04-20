import AuthLayout from "../features/AuthLayout";
import RegisterForm from "../features/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout imageCaption="The New Collection">
      <RegisterForm />
    </AuthLayout>
  );
}
