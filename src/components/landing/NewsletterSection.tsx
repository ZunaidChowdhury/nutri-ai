"use client";

import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { HiMail } from "react-icons/hi";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-default-50 px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-xl text-center">
        <HiMail className="mx-auto mb-4 size-10 text-primary" />
        <h2 className="mb-2 text-3xl font-bold">Stay Updated</h2>
        <p className="mb-8 text-foreground/60">
          Get the latest nutrition tips, new features, and meal ideas delivered
          to your inbox.
        </p>

        {subscribed ? (
          <p className="text-lg font-semibold text-success">
            Thanks for subscribing!
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-3">
            <Input
              type="email"
              value={email}
              onValueChange={setEmail}
              placeholder="Enter your email"
              isRequired
              className="flex-1"
            />
            <Button type="submit" color="primary">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
