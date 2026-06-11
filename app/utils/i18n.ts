import { ref } from 'vue'

export const currentLang = ref<'vi' | 'en'>('vi')

export const translations = {
  vi: {
    // Business logic errors (E0 - E99)
    E0: 'Email này đã được đăng ký trên hệ thống.',
    E1: 'Không tìm thấy người dùng.',
    E2: 'Mã OTP không hợp lệ hoặc đã hết hạn.',
    E3: 'Email này đã được xác thực.',
    E4: 'Yêu cầu đặt lại mật khẩu đã hết hạn hoặc không tìm thấy.',
    E5: 'Định dạng mã đặt lại mật khẩu không hợp lệ.',
    E6: 'Mã đặt lại mật khẩu đã được sử dụng hoặc đã hết hạn.',
    E7: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
    E8: 'Loại mã đặt lại mật khẩu không đúng.',
    E9: 'Email hoặc mật khẩu không chính xác.',
    E10: 'Vui lòng xác thực email trước khi đăng nhập.',
    E11: 'Phiên làm việc đã bị thu hồi.',
    E12: 'Phiên làm việc không hoạt động hoặc đã hết hạn.',
    E13: 'Phát hiện hành vi đăng nhập bất thường. Phiên làm việc đã bị thu hồi.',
    E14: 'Không tìm thấy phiên làm việc.',
    E15: 'Bạn không có quyền thu hồi phiên làm việc này.',
    E16: 'Tài khoản của bạn đã bị khóa hoặc xóa.',
    E100: 'Vui lòng kiểm tra lại thông tin đầu vào.',
    
    // Validation (V0 - V99)
    V0: 'Địa chỉ email không hợp lệ.',
    V1: 'Mật khẩu phải có ít nhất 8 ký tự.',
    V2: 'Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ số và một ký tự đặc biệt.',
    V3: 'Mật khẩu xác nhận không khớp.',
    V4: 'Bạn phải đồng ý với Điều khoản và Chính sách bảo mật.',
    V5: 'Mật khẩu không được để trống.',
    V6: 'Email không được để trống.',
    V7: 'Mã OTP không được để trống.',
    V8: 'Mã OTP phải có đúng 6 chữ số.',
    V9: 'Xác nhận mật khẩu không được để trống.',

    // Success (S0 - S99)
    S0: 'Xác thực OTP thành công.',
    S1: 'Đặt lại mật khẩu thành công.',
    S2: 'Mã OTP xác thực đã được gửi đến email của bạn.',
    S3: 'Mã OTP đặt lại mật khẩu đã được gửi đến email của bạn.',
    S4: 'Gửi lại mã OTP xác thực thành công.',
    S5: 'Đăng xuất thành công.',
    S6: 'Đã thu hồi phiên làm việc thành công.',
  },
  en: {
    // Business logic errors (E0 - E99)
    E0: 'Email already registered.',
    E1: 'User not found.',
    E2: 'Invalid or expired OTP.',
    E3: 'Email already verified.',
    E4: 'Reset token is missing or expired.',
    E5: 'Invalid reset token format.',
    E6: 'Reset token has already been used or has expired.',
    E7: 'Invalid or expired reset token.',
    E8: 'Invalid reset token type.',
    E9: 'Invalid email or password.',
    E10: 'Please verify your email address before logging in.',
    E11: 'Session has been revoked.',
    E12: 'Session is inactive or expired.',
    E13: 'Token reuse detected. Session revoked.',
    E14: 'Session not found.',
    E15: 'Cannot revoke session belonging to another user.',
    E16: 'Account has been suspended or deleted.',
    E100: 'Please correct the validation errors.',

    // Validation (V0 - V99)
    V0: 'Invalid email address.',
    V1: 'Password must be at least 8 characters.',
    V2: 'Password must contain at least one lowercase letter, one number, and one special character.',
    V3: 'Passwords do not match.',
    V4: 'You must agree to the Terms & Privacy Policy.',
    V5: 'Password is required.',
    V6: 'Email is required.',
    V7: 'OTP is required.',
    V8: 'OTP must be exactly 6 digits.',
    V9: 'Confirm password is required.',

    // Success (S0 - S99)
    S0: 'OTP verified successfully.',
    S1: 'Password reset successful.',
    S2: 'Verification OTP has been sent to your email.',
    S3: 'Password reset OTP has been sent to your email.',
    S4: 'Verification OTP has been resent successfully.',
    S5: 'Logout successful.',
    S6: 'Session revoked successfully.',
  }
} as const

export const t = (key: string): string => {
  const lang = currentLang.value
  const dict = translations[lang] || translations['en']
  return (dict as any)[key] || key
}
