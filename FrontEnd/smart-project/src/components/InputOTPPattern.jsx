
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function InputOTPPattern({ onOTPChange }) {
  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} onChange={onOTPChange}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}