'use client';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import MobileComponentUploaderAdmin from '@/components/VideoUploader';
import { collection, Firestore, getDocs } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/config';

export default function AddContent() {
  const { user, logout } = useAuth();
  const [currentloc, setcurrentloc] = useState('add')
  const [data, setdata] = useState()
  const router = useRouter();
 const db=getFirestore(app)
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      router.push('/');
    }
  }, [user, router]);
  useEffect(()=>{
    if(currentloc=="view"){
        getDocs(collection(db,"components")).then((querySnapshot) => {
            let temp=[]
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            })
            setdata(temp)
        })
    }
  },[currentloc])

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
    <div style={{ width:400,height:50,backgroundColor:'lightgray',borderRadius:15,padding:7}}>
        <button onClick={()=>{setcurrentloc('add')}}  className="flex-row" style={{width:'49%',height:'100%',backgroundColor:currentloc=="add"?'white':'lightgray',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
           <h3 style={{fontSize:15,fontWeight:'bold',color:'black'}}>Add Component</h3>
        </button>
        <button onClick={()=>{setcurrentloc('view')}} className="flex-row" style={{width:'49%',height:'100%',backgroundColor:currentloc=="view"?'white':'lightgray',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
           <h3 style={{fontSize:15,fontWeight:'bold',color:'black'}}>View Components</h3>
        </button>
    </div>
      {currentloc=="add"&&<MobileComponentUploaderAdmin/>}
      {
            currentloc=="view"&&data&&data.map((item,index)=>{
                return <div key={index} style={{ width:"100%",backgroundColor:'lightgray',borderRadius:15,padding:7,marginTop:20}}>
                <video 
            controls 
            className="w-full max-h-64 object-contain"
            src={item.videoSrc}
          >
            Your browser does not support the video tag.
          </video>
                </div>
            })
      }
      <button
        onClick={logout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}