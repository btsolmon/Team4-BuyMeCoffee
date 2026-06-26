import React from "react";

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

export function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="w-full p-2 border rounded-lg" />
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
