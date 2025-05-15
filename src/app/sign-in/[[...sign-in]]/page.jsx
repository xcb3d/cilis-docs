import { SignIn } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen self-center">
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
}
