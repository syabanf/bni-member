import type { PaymentCategory } from "@/domain/entities/Payment";
import { formatCurrency } from "./format";

/**
 * Normalise an Indonesian mobile number to the international digits wa.me wants:
 * strips spaces/dashes/parens and converts a leading "0" to "62".
 * "0812-3456-0001" -> "6281234560001".
 */
export function normalizePhoneId(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("620")) digits = `62${digits.slice(3)}`;
  return digits;
}

/** Build a wa.me click-to-chat link with a pre-filled (autotext) message. */
export function waLink(phone: string, text: string): string {
  return `https://wa.me/${normalizePhoneId(phone)}?text=${encodeURIComponent(text)}`;
}

interface ReminderTarget {
  name: string;
  chapter: string;
  amount?: number;
}

/** Pre-filled WhatsApp reminder text (autotext) per payment bucket. */
export function reminderText(category: PaymentCategory, r: ReminderTarget): string {
  const amount = r.amount ? ` sebesar ${formatCurrency(r.amount)}` : "";
  const sign = "\n\n— Pengurus BNI " + r.chapter;
  switch (category) {
    case "outstanding":
      return `Halo ${r.name}, ini pengingat dari BNI ${r.chapter}. Iuran keanggotaan Anda${amount} masih *belum lunas (outstanding)*. Mohon segera diselesaikan ya. Terima kasih 🙏${sign}`;
    case "awaiting":
      return `Halo ${r.name}, kami masih *menunggu konfirmasi pembayaran* iuran BNI ${r.chapter}${amount}. Mohon kirimkan bukti transfer ya. Terima kasih 🙏${sign}`;
    case "renewal":
      return `Halo ${r.name}, masa keanggotaan BNI ${r.chapter} Anda akan segera *jatuh tempo untuk perpanjangan (renewal)*. Yuk lakukan renewal agar keanggotaan tetap aktif. Terima kasih 🙏${sign}`;
    case "overdue":
      return `Halo ${r.name}, pembayaran iuran BNI ${r.chapter}${amount} telah *jatuh tempo (overdue)*. Mohon segera diselesaikan untuk menghindari penonaktifan keanggotaan. Terima kasih 🙏${sign}`;
  }
}
