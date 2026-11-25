import Link from "next/link";
import { brand } from "@/lib/brand";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: `Create your account: ${brand.name}`,
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-4xl">Create your account</h1>
      <p className="mt-3 text-lg text-ink-soft">
        It takes a minute. You can add your first medicine right after.
      </p>

      <div className="mt-8 rounded-bay border-2 border-ink bg-tablet p-6">
        <RegisterForm />
      </div>

      <p className="mt-6 text-lg">
        Already have an account?{" "}
        <Link href="/login" className="font-bold underline">
          Log in
        </Link>
      </p>
    </>
  );
}