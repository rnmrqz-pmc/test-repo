
// ===============================
// Validation Rules for Form Inputs
// ===============================

export const required_rule = (v: string) =>
  !!v || "This field is required";

export const email_rule = (v: string) =>
  /.+@.+\..+/.test(v) || "E-mail must be valid";

export const minLength_rule = (length: number) => (v: string) =>
  (v && v.length >= length) || `Minimum ${length} characters required`;

export const link_rule = (v: string) => {
  try {
    new URL(v);
    return true;
  } catch {
    return "Invalid link";
  }
};


export const drive_link_rule = (v: string) => {
  const regex = /^(https?:\/\/)?(www\.)?(drive\.google\.com|dropbox\.com)\/.+$/;
  return regex.test(v) || "Please enter a valid Google Drive link";
}

export const address_rule = (v: string) => {
  const regex =
    /^[-\w\s],\s[-\w\s]+\s\(\d{1,2}\.\d{1,15},\s-\d{1,2}\.\d{1,15}\)$/;
  return regex.test(v) || "Invalid location address";
};

export const number_rule = (v: string) => {
  const regex = /^-?\d*\.?\d+$/;
  return regex.test(v) && v[0] !== '-' || "Invalid number";
}

export const year_rule = (v: string) => {
  const year = parseInt(v);
  return (year >= 1600 && year <= 2500) || "Invalid year";
}