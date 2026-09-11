import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth, db } from "@/lib/auth/betterAuth";
import SignInSpinner from "./SignInSpinner";

export const dynamic = "force-dynamic";

export default async function SocialSigninPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email.toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const role: "admin" | "user" =
    !!adminEmail && email === adminEmail ? "admin" : "user";

  await db.collection("users").updateOne(
    { email },
    { $set: { role, updatedAt: new Date() } },
  );

  return <SignInSpinner role={role} email={session.user.email} />;
}