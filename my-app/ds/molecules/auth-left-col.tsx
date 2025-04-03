import React from "react";
import AppLogo from "../atoms/app-logo";

interface AuthLeftColProps {
  title?: string;
  subtitle?: string;
}

export const AuthLeftCol = ({
  title = "Jaseci",
  subtitle = "Build the next generation of AI Products",
}: AuthLeftColProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mb-8 text-center">
        <AppLogo />
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};
