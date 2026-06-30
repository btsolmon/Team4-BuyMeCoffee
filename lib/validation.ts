// Auth-ийн бүх regex болон шалгалтыг нэг дор төвлөрүүлсэн модуль.
// Frontend (form hint) болон backend (API route) хоёулаа ашиглаж болно.

// Email: local@domain.tld — энгийн, найдвартай хувилбар.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username: 3-20 тэмдэгт, зөвхөн үсэг/тоо/доогуур зураас, үсэг/тоогоор эхэлнэ.
export const USERNAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9_]{2,19}$/;

// Password regex (доор тус бүрд нь шалгахад ашиглана).
export const PASSWORD_RULES = {
  minLength: /.{8,}/, // дор хаяж 8 тэмдэгт
  lowercase: /[a-z]/, // нэг жижиг үсэг
  uppercase: /[A-Z]/, // нэг том үсэг
  number: /[0-9]/, // нэг тоо
  special: /[^a-zA-Z0-9]/, // нэг тусгай тэмдэгт
} as const;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidUsername(value: string): boolean {
  return USERNAME_RE.test(value.trim());
}

export type PasswordCheck = {
  label: string;
  passed: boolean;
};

// Password-ийн бүх шаардлагыг шалгаж, hint жагсаалт буцаана.
export function checkPassword(value: string): PasswordCheck[] {
  return [
    { label: "Дор хаяж 8 тэмдэгт", passed: PASSWORD_RULES.minLength.test(value) },
    { label: "Жижиг үсэг (a-z)", passed: PASSWORD_RULES.lowercase.test(value) },
    { label: "Том үсэг (A-Z)", passed: PASSWORD_RULES.uppercase.test(value) },
    { label: "Тоо (0-9)", passed: PASSWORD_RULES.number.test(value) },
    {
      label: "Тусгай тэмдэгт (!@#$...)",
      passed: PASSWORD_RULES.special.test(value),
    },
  ];
}

// Password хангалттай хүчтэй эсэх (бүх дүрэм давсан эсэх).
export function isStrongPassword(value: string): boolean {
  return checkPassword(value).every((c) => c.passed);
}

// 0-5 хооронд хүч. UI-д progress bar/өнгө харуулахад тохиромжтой.
export function passwordStrength(value: string): number {
  return checkPassword(value).filter((c) => c.passed).length;
}

// Username-ийн алдааг хүний ойлгомжтой мессеж болгож буцаана.
export function usernameError(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (v.length < 3) return "Дор хаяж 3 тэмдэгт байх ёстой";
  if (v.length > 20) return "20 тэмдэгтээс ихгүй байх ёстой";
  if (!/^[a-zA-Z0-9]/.test(v)) return "Үсэг эсвэл тоогоор эхлэх ёстой";
  if (!USERNAME_RE.test(v))
    return "Зөвхөн үсэг, тоо, доогуур зураас ( _ ) ашиглана";
  return null;
}
