
import { AuthProvider } from '@/lib/auth';
import { configDotenv } from 'dotenv';
export default function RootLayout({ children }) {
  return (
    <div>
        <div style={{width:200,height:60,borderRadius:15,backgoundColor:'red'}}>
         
        </div>
        {children}
    </div>
  );
}