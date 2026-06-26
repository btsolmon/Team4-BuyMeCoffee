/* eslint-disable react-hooks/set-state-in-effect */
"use client";
 
import { useEffect, useState } from "react";
import { CurrentUser, MONTHS } from "../types";
import {
  FormSection,
  InputField,
  TextAreaField,
  SaveButton,
} from "./FormControls";
 
export function AccountSettings({
  currentUser,
}: {
  currentUser: CurrentUser | null;
}) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [socialMediaURL, setSocialMediaURL] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 
  const [country, setCountry] = useState("Mongolia");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiresMonth, setExpiresMonth] = useState("");
  const [expiresYear, setExpiresYear] = useState("");
  const [cvc, setCvc] = useState("");
 
  const [successMessage, setSuccessMessage] = useState("");
 
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingSuccess, setSavingSuccess] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
 
  useEffect(() => {
    if (currentUser?.profile) {
      setName(currentUser.profile.name ?? "");
      setAbout(currentUser.profile.about ?? "");
      setSocialMediaURL(currentUser.profile.socialMediaURL ?? "");
      setSuccessMessage(currentUser.profile.successMessage ?? "");
    }
    if (currentUser?.bankCard) {
      const card = currentUser.bankCard;
      setCountry(card.country ?? "Mongolia");
      setFirstName(card.firstName ?? "");
      setLastName(card.lastName ?? "");
      setCardNumber(card.cardNumber ?? "");
      if (card.expiryDate) {
        const d = new Date(card.expiryDate);
        if (!isNaN(d.getTime())) {
          setExpiresMonth(MONTHS[d.getMonth()]);
          setExpiresYear(String(d.getFullYear()));
        }
      }
    }
  }, [currentUser]);
 
  async function handlePersonalInfoSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
 
    setSavingPersonal(true);
    try {
      const res = await fetch(`/api/profile/${currentUser.profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, about, socialMediaURL }),
      });
      if (res.ok) {
        alert("Personal info updated successfully!");
      } else {
        const error = await res.json();
        alert(`Error: ${error.error ?? error.message}`);
      }
    } catch (error) {
      console.error("Failed to save personal info:", error);
      alert("An unexpected error occurred.");
    } finally {
      setSavingPersonal(false);
    }
  }
 
  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (!currentUser) return;
 
    setSavingPassword(true);
    try {
      const res = await fetch(`/api/user/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });
 
      if (res.ok) {
        alert("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await res.json();
        alert(`Error: ${error.message ?? error.error}`);
      }
    } catch (error) {
      console.error("Failed to save new password:", error);
      alert("An unexpected error occurred.");
    } finally {
      setSavingPassword(false);
    }
  }
 
  async function handlePaymentSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
 
    if (
      !firstName ||
      !lastName ||
      !cardNumber ||
      !expiresMonth ||
      !expiresYear
    ) {
      alert("Please fill in all payment fields.");
      return;
    }
 
    const monthIndex = MONTHS.indexOf(expiresMonth);
    const expiryDate = new Date(
      Number(expiresYear),
      monthIndex < 0 ? 0 : monthIndex,
      1,
    ).toISOString();
 
    setSavingPayment(true);
    try {
      const res = await fetch(`/api/bankcard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          country,
          firstName,
          lastName,
          cardNumber,
          expiryDate,
        }),
      });
 
      if (res.ok) {
        alert("Payment details saved successfully!");
        setCvc("");
      } else {
        const error = await res.json();
        alert(`Error: ${error.error ?? error.message}`);
      }
    } catch (error) {
      console.error("Failed to save payment details:", error);
      alert("An unexpected error occurred.");
    } finally {
      setSavingPayment(false);
    }
  }
 
  async function handleSuccessPageSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
 
    setSavingSuccess(true);
    try {
      const res = await fetch(`/api/profile/${currentUser.profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ successMessage }),
      });
 
      if (res.ok) {
        alert("Success page message saved!");
      } else {
        const error = await res.json();
        alert(`Error: ${error.error ?? error.message}`);
      }
    } catch (error) {
      console.error("Failed to save success message:", error);
      alert("An unexpected error occurred.");
    } finally {
      setSavingSuccess(false);
    }
  }
 
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">My account</h1>
 
      <FormSection title="Personal Info" onSubmit={handlePersonalInfoSave}>
        <div className="flex items-center gap-4 mb-4">
          <div
            style={{
              width: 160,
              height: 160,
              backgroundImage: `url(${currentUser?.profile.avatarImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="rounded-full ring-4 ring-white bg-gray-200"
          />
        </div>
        <InputField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextAreaField
          label="About"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        <InputField
          label="Social media URL"
          value={socialMediaURL}
          onChange={(e) => setSocialMediaURL(e.target.value)}
        />
        <SaveButton loading={savingPersonal} />
      </FormSection>
 
      <FormSection title="Set a new password" onSubmit={handlePasswordSave}>
        <InputField
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <InputField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />
        <SaveButton loading={savingPassword} />
      </FormSection>
 
      <FormSection title="Payment details" onSubmit={handlePaymentSave}>
        <label className="block text-sm font-medium mb-1">Select country</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        >
          <option value="Mongolia">Mongolia</option>
          <option value="United States">United States</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First name"
            placeholder="Jake"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            label="Last name"
            placeholder="Mulligan"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <InputField
          label="Enter card number"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expires</label>
            <select
              value={expiresMonth}
              onChange={(e) => setExpiresMonth(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <InputField
            label="Year"
            placeholder="2028"
            value={expiresYear}
            onChange={(e) => setExpiresYear(e.target.value)}
          />
          <InputField
            label="CVC"
            placeholder="590"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
        </div>
        <SaveButton loading={savingPayment} />
      </FormSection>
 
      <FormSection title="Success page" onSubmit={handleSuccessPageSave}>
        <TextAreaField
          label="Confirmation message"
          placeholder="Thank you for supporting me!..."
          value={successMessage}
          onChange={(e) => setSuccessMessage(e.target.value)}
        />
        <SaveButton loading={savingSuccess} />
      </FormSection>
    </div>
  );
}
 
 