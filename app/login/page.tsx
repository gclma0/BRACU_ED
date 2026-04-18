import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import LogInForm from "./login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <LogInForm />
    </div>
  );
}
