'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { verifyOTP } from '../lib/api';
import { useAuth } from '../lib/auth';
import { collection, getDoc, getDocs, query, updateDoc,onSnapshot, where, doc, } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/config';

export default function OTPForm({route}) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const inputRefs = useRef([]);
  const db=getFirestore(app)
  const params = useParams()
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    setIsLoading(true);
    try {
        const email=params.email.replace("%40", '@')
        const q = query(
            collection(db, "otp"),
            where("otp", "==", otpString),
            where("email", "==", email),
            where("used", "==", 0)
          );
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot.docs[0].id)
          const resp=querySnapshot.docs[0].data()
          console.log(resp)
          if (!resp){
            alert("Invalid OTP")
            return;
          }
          else if(resp.expiresIn > Date.now()){
            console.log("OTP verified");
            await updateDoc(doc(db, "otp", querySnapshot.docs[0].id), { used: 1 });
            router.push(`/content`);
            
          }
          else
          {
            alert("OTP expired");
            return;
          }
          
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            One-Time Password
          </label>
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className="shadow appearance-none border rounded w-12 h-12 text-center text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>
    </div>
  );
}