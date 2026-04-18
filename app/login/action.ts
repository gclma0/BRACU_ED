"use server";
import { signIn } from "@/auth";
import {
  signInFormSchema,
  TSignInFormSchema,
} from "@/lib/zod-validation/auth-schema";
import { AuthError } from "next-auth";

export async function LogInAction(values: TSignInFormSchema) {
  try {
    const validation = signInFormSchema.safeParse(values);

    if (!validation.success) {
      return { error: "Invalid values! Please check your inputs!" };
    }
    const { email, password } = validation.data;

    // Attempt to sign in without redirect
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Log in successful." };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { error: "Something went wrong!" };
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}
