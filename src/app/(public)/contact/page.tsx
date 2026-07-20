"use client";

import { Button, Input, Textarea } from "@heroui/react";
import { useState } from "react";
import { HiMail, HiLocationMarker } from "react-icons/hi";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import Link from "next/link";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary-50/50 to-transparent px-4 py-20 text-center dark:from-primary-950/20 md:px-8 lg:px-16">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
        <p className="mx-auto max-w-2xl text-lg text-foreground/60">
          Have a question, suggestion, or just want to say hello? We would love to hear from you.
        </p>
      </section>

      <section className="px-4 py-16 md:px-8 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Get in Touch</h2>
              <p className="text-foreground/60">
                Reach out and we will get back to you as soon as possible.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <HiMail className="size-5 text-primary" />
              <Link
                href="mailto:hello@nutriai.app"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                hello@nutriai.app
              </Link>
            </div>

            <div className="flex items-start gap-3">
              <HiLocationMarker className="size-5 shrink-0 mt-0.5 text-primary" />
              <span className="text-foreground/70">
                San Francisco, CA
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              {[
                { href: "https://github.com", icon: FaGithub, label: "GitHub" },
                { href: "https://x.com", icon: FaXTwitter, label: "Twitter" },
                { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-foreground/50 hover:text-foreground transition-colors"
                >
                  <social.icon className="size-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-success/30 bg-success-50 px-8 py-16 text-center dark:bg-success-950/20">
                <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
                  <HiMail className="size-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-success-600 dark:text-success-400">
                  Message Sent!
                </h3>
                <p className="max-w-md text-foreground/60">
                  Thank you for reaching out. We have received your message and will get back to you shortly.
                </p>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setSubject("");
                    setMessage("");
                    setErrors({});
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Name"
                    value={name}
                    onValueChange={setName}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    isRequired
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onValueChange={setEmail}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                    isRequired
                  />
                </div>
                <Input
                  label="Subject"
                  value={subject}
                  onValueChange={setSubject}
                  isInvalid={!!errors.subject}
                  errorMessage={errors.subject}
                  isRequired
                />
                <Textarea
                  label="Message"
                  value={message}
                  onValueChange={setMessage}
                  isInvalid={!!errors.message}
                  errorMessage={errors.message}
                  minRows={4}
                  isRequired
                />
                <Button type="submit" color="primary" size="lg" className="self-start">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
