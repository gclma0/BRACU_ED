"use server";

import { db } from "@/lib/prisma";

import bcrypt from "bcryptjs";
import {
  signUpFormSchema,
  TSignUpFormSchema,
} from "@/lib/zod-validation/auth-schema";

export async function RegisterAction(values: TSignUpFormSchema) {
  try {
    const validation = signUpFormSchema.safeParse(values);

    if (!validation.success) {
      return { error: "Invalid values! Please check your inputs!" };
    }

    const { email, name, password, userRole } = validation.data;

    try {
      const userExist = await db.profile.findUnique({
        where: { email },
      });

      if (userExist) return { error: "Email already exist." };
    } catch (dbError) {
      console.error("Database error checking email:", dbError);
      return { error: "Unable to check email. Please try again." };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    try {
      await db.profile.create({
        data: {
          name,
          email,
          password: hashPassword,
          role: userRole,
        },
      });
      return { success: "Account created successfully." };
    } catch (createError) {
      console.error("Database error creating user:", createError);
      return { error: "Unable to create account. Please try again." };
    }
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}}
