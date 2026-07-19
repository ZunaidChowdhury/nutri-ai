import { Card } from "@heroui/react";
import { FiLock } from "react-icons/fi";

export default function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning-100">
          <FiLock className="h-8 w-8 text-warning-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Unauthorized</h2>
        <p className="mb-4 text-default-500">
          You need to sign in to access this page. Please log in and try again.
        </p>
      </Card>
    </div>
  );
}
