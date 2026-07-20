"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, Input, Button, Divider, Link } from "@heroui/react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiUpload } from "react-icons/fi";
import { registerSchema } from "@/lib/validation/auth";
import { authClient } from "@/lib/auth/client";

export default function RegisterPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: null as File | null,
    password: "",
    confirmPassword: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      const message =
        error.message?.toLowerCase().includes("already") ||
        error.message?.toLowerCase().includes("exists") ||
        error.message?.toLowerCase().includes("duplicate")
          ? "An account with this email already exists"
          : error.message || "Something went wrong";
      setApiError(message);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-2 text-2xl font-bold">Create Account</h1>
        <p className="mb-6 text-default-500">
          Join NutriAI and start your nutrition journey
        </p>

        <Button
          variant="bordered"
          size="lg"
          className="w-full"
          startContent={
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          }
          onPress={handleGoogleLogin}
          isDisabled={loading}
        >
          Continue with Google
        </Button>

        <Divider className="my-6" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onValueChange={(v) => handleChange("name", v)}
            startContent={<FiUser className="text-default-400" />}
            isInvalid={!!errors.name}
            errorMessage={errors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onValueChange={(v) => handleChange("email", v)}
            startContent={<FiMail className="text-default-400" />}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
          />

          {/* Profile image upload */}
          <div
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-default-300 px-4 py-3 hover:border-primary transition-colors"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full bg-default-100">
                <FiUpload className="text-default-400" size={18} />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm text-default-700">Profile Image</span>
              <span className="text-xs text-default-400">
                {form.image ? form.image.name : "Optional. Click to upload."}
              </span>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setForm((prev) => ({ ...prev, image: file }));
              const reader = new FileReader();
              reader.onload = () => setImagePreview(reader.result as string);
              reader.readAsDataURL(file);
            }}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            value={form.password}
            onValueChange={(v) => handleChange("password", v)}
            startContent={<FiLock className="text-default-400" />}
            endContent={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((p) => !p)}
                className="text-default-400 hover:text-default-600 outline-none"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            }
            isInvalid={!!errors.password}
            errorMessage={errors.password}
          />

          <Input
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onValueChange={(v) => handleChange("confirmPassword", v)}
            startContent={<FiLock className="text-default-400" />}
            endContent={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((p) => !p)}
                className="text-default-400 hover:text-default-600 outline-none"
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            }
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
          />

          {apiError && (
            <p className="rounded-md bg-danger-50 p-3 text-sm text-danger">
              {apiError}
            </p>
          )}

          <Button
            type="submit"
            color="primary"
            size="lg"
            isLoading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-default-500">
          Already have an account?{" "}
          <Link href="/login" size="sm">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
