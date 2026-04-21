import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout imageCaption="The New Collection">
      <RegisterForm />
    </AuthLayout>
  );
}
