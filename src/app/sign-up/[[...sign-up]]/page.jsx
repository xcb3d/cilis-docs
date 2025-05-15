import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen self-center">
      <SignUp signInUrl="/sign-in"/>
    </div>
  );
}
