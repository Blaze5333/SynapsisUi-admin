import React, { useState } from 'react';
import { ref, uploadBytesResumable ,getDownloadURL} from 'firebase/storage';
import { storage,app } from '@/lib/config';
import {getFirestore} from "@firebase/firestore"
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
  } from "firebase/firestore";

export default function MobileComponentUploaderAdmin() {
  const [componentName, setComponentName] = useState('');
  const [componentFamily, setComponentFamily] = useState('');
  const [componentCode, setComponentCode] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const db=getFirestore(app)
  const [progressBar, setprogressBar] = useState(0)
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the form submission, including all the component details
    // You'd typically send this data to your server here
    const date=new Date()
    const fileref=ref(storage,'components/'+video.name+date)
    
    const uploadTask=uploadBytesResumable(fileref,video)
    uploadTask.on('state_changed',(snapshot)=>{
         let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //  progress=Math.trunc(progress)
        setprogressBar(progress)
         
    },(error)=>{
        console.log(error)
    },()=>{
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                getDocs(collection(db,"components")).then((querySnapshot)=>{
                    let id=querySnapshot.docs.length+1
                    let data={
                        id,
                        name:componentName,
                        category:componentFamily,
                        videoSrc:downloadURL,
                        code:[
                            {
                                "language":"terminal",
                                "code":dependencies
                            },
                            {
                                "language":"javascript",
                                "code":componentCode
                            }
                        ]
                    }
                    addDoc(collection(db,"components"),data).then(()=>{
                        alert("Component Uploaded Successfully")
                    })
                })
            })
            
            
         
    })

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-1">
      <h2 className="text-2xl font-bold mb-6">Upload Mobile Component</h2>

      <div className="space-y-2">
        <label htmlFor="component-name" className="block text-sm font-medium">Component Name</label>
        <input
          id="component-name"
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="Enter component name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="component-family" className="block text-sm font-medium">Component Family</label>
        <input
          id="component-family"
          type="text"
          value={componentFamily}
          onChange={(e) => setComponentFamily(e.target.value)}
          placeholder="Enter component Family name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="component-code" className="block text-sm font-medium">Component Code</label>
        <textarea
          id="component-code"
          value={componentCode}
          onChange={(e) => setComponentCode(e.target.value)}
          placeholder="Paste the component code here"
          rows={20}
          required
          
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="dependencies" className="block text-sm font-medium">Dependencies</label>
        <textarea
          id="dependencies"
          value={dependencies}
          onChange={(e) => setDependencies(e.target.value)}
          placeholder="List dependencies (one per line)"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="video-upload" className="block text-sm font-medium">Upload Component Video</label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full"
        />
      </div>

      {previewUrl && (
        <div className="mt-4">
          <video 
            controls 
            className="w-full max-h-64 object-contain"
            src={previewUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {progressBar&&<div className="flex-row" style={{display:'flex',gap:10,alignItems:'center'}}>
        <div style={{height:40,width:"90%",backgroundColor:"lightgrey",borderRadius:15}}>
         <div style={{height:40,width:`${progressBar}%`,backgroundColor:'green',borderRadius:15}}></div>
      </div>
      <div>
       <h2 style={{fontSize:22}}>{`${progressBar.toFixed(2)}%`}</h2>
       </div>
      </div>}
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Upload Component
      </button>
    </form>
  );
}