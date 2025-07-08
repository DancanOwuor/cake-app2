"use client";
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner'; //a Shadcn component

const Userslogin = () => {
   const [formData, setFormData] = useState({
      username: "",
      role: "",
      email: "",
      password: ""})
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showpassword, setShowPassword] = useState(false);
  const router = useRouter()

  const SignUpredirect = ()=>{
       setTimeout(() => {
        router.push('/Register') // 🔁 Change to your desired rout
        setIsSignedUp(true)
      }, 1200)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {   //The type annotation React.ChangeEvent<HTMLInputElement> specifies that this is a change event coming from an HTML input element.
         const { name, value } = e.target;  // extracts the name and value properties from the event target (the input element that triggered the change).
         setFormData(prev => ({ ...prev, [name]: value }))
        }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    try{
      const res = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include"   //allows sending of Cookies
        });
        
        const data = await res.json()

        if (res.ok) {
          localStorage.setItem("token", data.token);
          //console.log(formData)
          localStorage.setItem("Userdata", JSON.stringify(data.user));
          router.push('/home') // 🔁 Change to your desired route
          toast.success("🎉 Login successful! Welcome back.")

          // 🔄 Reset fields
          setFormData({
          username: "",
          role: "",
          email: "",
          password: ""})
          setIsLoggedIn(false);
        } else {
                toast.error(data.error + " " + "Please try again.")
                console.log(formData)
                setIsLoggedIn(false)
        } 
      } catch(error:unknown){
          if (error instanceof Error) {
             toast.error(error.message)
              setIsLoggedIn(false);
          }
    }
  };
  return (
    <div className='w-[300px] h-[335px] font-bold text-white rounded-[4px] bg-sky-600 relative'>
        
      <form onSubmit={handleSubmit} method="POST" 
            className='p-2   flex-row'>
              <h1 className='text-3xl text-center text-white'>Login</h1>
              <div className='flex flex-col gap-4 mt-3 items-center'>
                    <input type='text'
                     name='username'
                     placeholder='Username: '
                     value={formData.username}
                     onChange={handleChange} 
                     className='border-b-1 focus:outline-none px-1 border-black w-[85%] pb-2'/>

                    <input type="text"
                      name='role'
                      placeholder='Role: ' 
                      value={formData.role}
                      onChange={handleChange}                      
                      className='border-b-1 focus:outline-none px-1 border-black w-[85%] pb-2'/>

                     <input type='email'
                      name='email'
                      placeholder='Email: ' 
                      value={formData.email}
                      onChange={handleChange}
                      className='border-b-1 focus:outline-none px-1 border-black  w-[85%] pb-2'/>

                    <div className='relative p-0 w-[240px]'>
                      <input type={showpassword? "text" : "password"}
                          name='password'
                          placeholder='Password: '
                          value={formData.password}
                          onChange={handleChange}
                          className='border-b-1 focus:outline-none px-1 border-black w-[100%] pb-2'/>
                            <div onClick={()=>setShowPassword(!showpassword)}>
                              {showpassword? (<FaEye className='absolute right-5 top-1'/>):<FaEyeSlash className='absolute right-5 top-1'/> }                              
                            </div>
                    </div>          

                    <div className='flex gap-8 mt-2'>
                      <button  type="button" onClick={SignUpredirect} className='bg-green-400 hover:bg-orange-500 hover:text-white rounded-[4px] h-[45px] w-[103px] flex items-center justify-center'>
                             {isSignedUp ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />) : ('SignUp')
                            }
                        </button>
                        <button type="submit" className='bg-black hover:bg-white hover:text-black rounded-[4px] h-[45px] w-[103px] flex items-center justify-center'>
                             {isLoggedIn ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />) : ('Login')
                            }
                        </button> 
                    </div>
              </div>
      </form>
    </div>
  )
}

export default Userslogin
