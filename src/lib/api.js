export async function sendOTP(email) {
    // This is a dummy implementation. In a real application, you would call your backend API.
    console.log(`Sending OTP to ${email}`);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  export async function verifyOTP(otp) {
    // This is a dummy implementation. In a real application, you would verify the OTP with your backend.
    console.log(`Verifying OTP: ${otp}`);
    return new Promise((resolve) => setTimeout(() => resolve({ email: 'user@example.com' }), 1000));
  }