"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function FormSection({
  title,
  children,
  onSubmit,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border p-6 rounded-xl shadow-sm space-y-4"
    >
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </form>
  );
}

type InputFieldProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputField({ label, type, ...props }: InputFieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`w-full p-2 border rounded-lg ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ label, ...props }: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea {...props} className="w-full p-2 border rounded-lg h-24" />
    </div>
  );
}

export function SaveButton({ loading = false }: { loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save changes"}
    </button>
  );
}
