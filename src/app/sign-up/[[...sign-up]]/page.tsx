import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
        <SignUp />
      </div>
    </main>
  );
}