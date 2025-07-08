"use client";
import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner'; //a Shadcn component


const Usersupload = () => {
   const [formData, setFormData] = useState({
    username: "",
    role: "",
    email: "",
    password: ""})
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  //const [alertMsg, setAlertMsg] = useState('')

  const router = useRouter();
  const [showpassword, setShowPassword] = useState(false);


  const Loginredirect = ()=>{
    
       setTimeout(() => {
        router.push('/login') // 🔁 Change to your desired route
         setIsLoggedIn(true)
      }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {   //The type annotation React.ChangeEvent<HTMLInputElement> specifies that this is a change event coming from an HTML input element.
       const { name, value } = e.target;  // extracts the name and value properties from the event target (the input element that triggered the change).
       setFormData(prev => ({ ...prev, [name]: value }))
      }
      
  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSignedUp(true)

     //setAlertMsg('')
  

    try{
      const verification = await fetch('/api/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email:formData.email}),
    });
      if (!verification.ok) {
         throw new Error('Failed to send verification code');
    }
      // 2. Store user data temporarily
     sessionStorage.setItem('tempUserData', JSON.stringify(formData));
     toast.success("Verication code sent to " + formData.email)
     router.push(`/EmailVerification?email=${encodeURIComponent(formData.email)}`); 
    } catch(error:unknown){
         if (error instanceof Error) {
           if(!formData){
              //setAlertMsg("empty Fields");
           toast.error("❌ Sign Up failed due to empty fields. Please try again.")
              
      }
               //setAlertMsg(error instanceof Error ? error.message : 'Signup failed');
               setIsSignedUp(false)
         }
    }finally {
      setIsLoggedIn(false);
    }
  };
   
  return (
    <> 
    <div className='w-[300px] h-[335px] font-bold text-white rounded-[5px] relative bg-purple-950'>

        {/*<div>  
            {alertMsg && (
                <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded-md shadow-lg transition-opacity duration-500 z-10">
                    {alertMsg}
                </div>)}
        </div>*/}
        
      <form onSubmit={handleSubmit} method="POST" className='p-2   w-[300px] h-[380px] flex-row'>
              <h1 className='text-3xl text-center text-orange-700'>Register</h1>
              <div className='flex flex-col gap-5 mt-3 items-center'>
                    <input type='text'
                     placeholder='Username: '
                     name='username'
                     value={formData.username}
                     onChange={handleChange} 
                     className='border-b-1 focus:outline-none  border-black w-[85%] pb-2'/>

                     <input type="text"
                      placeholder='Role: ' 
                      name='role' 
                      value={formData.role}
                      onChange={handleChange}
                      className='border-b-1 focus:outline-none px-1 border-black w-[85%] pb-2'/>

                     <input type='email'
                      placeholder='Email: '
                      name='email' 
                      value={formData.email}
                      onChange={handleChange}
                      className='border-b-1 focus:outline-none px-1 border-black w-[85%] pb-2'/>

                      <div className='relative p-0 w-[240px]'>
                          <input type={showpassword? "text" : "password"}
                            placeholder='Password: '
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='border-b-1 focus:outline-none px-1 border-black w-[100%]'/>
                            <div onClick={()=>setShowPassword(!showpassword)}>
                              {showpassword? (<FaEye className='absolute right-5 top-1'/>):<FaEyeSlash className='absolute right-5 top-1'/> }                                                        
                            </div>
                      </div>
                  
                    <div className='flex gap-6 mt-1'>
                        <button  type="button" onClick={Loginredirect} className='bg-black hover:bg-white hover:text-black text-white rounded-[4px] h-[45px] w-[103px] flex items-center justify-center'>
                            {isLoggedIn? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />) : ('Log in')
                            }
                              </button> 
                        <button type="submit" disabled={isSignedUp} className='bg-green-500 hover:bg-orange-500 hover:text-white rounded-[4px] h-[45px] w-[103px] flex items-center justify-center'>
                              {isSignedUp ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />) : ('Sign up')
                              }
                        </button>
                    </div>
              </div>
      </form>
    </div>
    </>
  )
}

export default Usersupload
