import { Card } from "@heroui/react";
import { FiShieldOff } from "react-icons/fi";

export default function Forbidden() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-100">
          <FiShieldOff className="h-8 w-8 text-danger-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Forbidden</h2>
        <p className="mb-4 text-default-500">
          You don&apos;t have permission to access this resource. Contact an
          administrator if you believe this is a mistake.
        </p>
      </Card>
    </div>
  );
}
