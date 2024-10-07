'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendOTP } from '../lib/api';
import axios from 'axios';
import { addDoc, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/config';
export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const db=getFirestore(app)
  const handleSubmit = async (e) => {
    if(!process.env.NEXT_PUBLIC_ADMIN.includes(email)){
        return alert("You are not authorized to use this service")
    }
    e.preventDefault();
    setIsLoading(true);
    try {
      const {data}=await axios.post(process.env.NEXT_PUBLIC_BACKEND_API+'/generateOtp',{email:email});
      const date=new Date()

      addDoc(collection(db,"otp"),{email:email,otp:data.otp,used:0,expiresIn:Date.now()+5*1000*60}).then(()=>{
        router.push('/otp/'+email,{email});
      }).catch(()=>{

      })
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      </form>
    </div>
  );
}