/** Payload encoded in the payment QR: UPI when CLINIC_UPI_VPA is set, else payment URL. */
export function invoiceQrPayload(inv) {
  const vpa = process.env.CLINIC_UPI_VPA?.trim();
  if (vpa) {
    const pn = encodeURIComponent(process.env.CLINIC_NAME || 'Clinic');
    const am = Number(inv.total).toFixed(2);
    const tn = encodeURIComponent(inv.number);
    return `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
  }
  if (inv.paymentUrl) return inv.paymentUrl;
  return null;
}
