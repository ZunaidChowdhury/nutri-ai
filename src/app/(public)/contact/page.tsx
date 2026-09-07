"use client";

import { Button, FieldError, Input, Label, TextArea, TextField } from "@heroui/react";
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
      <section className="bg-gradient-to-b from-accent-soft/50 to-transparent px-4 py-20 text-center dark:from-accent-soft/20 md:px-8 lg:px-16">
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
              <HiMail className="size-5 text-accent" />
              <Link
                href="mailto:hello@nutriai.app"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                hello@nutriai.app
              </Link>
            </div>

            <div className="flex items-start gap-3">
              <HiLocationMarker className="size-5 shrink-0 mt-0.5 text-accent" />
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
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-success/30 bg-success-soft px-8 py-16 text-center dark:bg-success-soft">
                <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
                  <HiMail className="size-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-success dark:text-success">
                  Message Sent!
                </h3>
                <p className="max-w-md text-foreground/60">
                  Thank you for reaching out. We have received your message and will get back to you shortly.
                </p>
                <Button
                  variant="primary"
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
                  <TextField
                    isInvalid={!!errors.name}
                    isRequired
                    className="w-full"
                  >
                    <Label>Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                    />
                    {errors.name && <FieldError>{errors.name}</FieldError>}
                  </TextField>
                  <TextField
                    isInvalid={!!errors.email}
                    isRequired
                    className="w-full"
                  >
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                    />
                    {errors.email && <FieldError>{errors.email}</FieldError>}
                  </TextField>
                </div>
                <TextField
                  isInvalid={!!errors.subject}
                  isRequired
                  className="w-full"
                >
                  <Label>Subject</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    fullWidth
                  />
                  {errors.subject && <FieldError>{errors.subject}</FieldError>}
                </TextField>
                <TextField
                  isInvalid={!!errors.message}
                  isRequired
                  className="w-full"
                >
                  <Label>Message</Label>
                  <TextArea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                  />
                  {errors.message && <FieldError>{errors.message}</FieldError>}
                </TextField>
                <Button type="submit" variant="primary" size="lg" className="self-start">
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