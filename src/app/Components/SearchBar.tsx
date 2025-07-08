"use client";
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react';
import { BiHelpCircle, BiUserCheck } from 'react-icons/bi';
interface SearchBarProps {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string
}


const SearchBar = ({search, setSearch}: SearchBarProps) => {
  const [loggedInUser, setLoggedinUser] = useState("")

  useEffect(()=>{
       const storedUser =  localStorage.getItem("Userdata");
       if (storedUser) {
        try{
          //console.log(storedUser)
          const Userinfo = JSON.parse(storedUser);// converts the storedUser into valid JSON
          //console.log(Userinfo)
          setLoggedinUser(Userinfo.username);

        } catch (error:unknown){
             if (error instanceof Error) {
                console.error("Error parsing user data:", error);
                setLoggedinUser("Error loading user");
             }
        }
    }
    if(!storedUser){
      setLoggedinUser("No User");
    }
  }, []);
  return (
    <div className='bg-white w-screen px-1 screen flex items-center md:rounded-[6px] md:px-2 justify-between md:justify-center h-[72px] gap-3 shadow-[0_10px_20px_rgba(12,12,12,0.2)] fixed top-[73px] left-0 z-40'>
      <div>
        <input   
         onChange={e => {setSearch(e.target.value)                
         console.log("Current search:", search);
}}
        name="Search"
        type="search" 
        placeholder='Search' 
        className=' text-[18px] w-[200px] md:w-[600px] px-2 py-1 md:p-2 border-2 md:rounded-[10px] rounded-full border-gray-300 mr-8'/>
      </div>
      <div className='flex items-center justify-between md:p-2 md:w-[300px]'>
           <h1 className='font-bold flex text-sm'><BiUserCheck size={25} className='mr-2 hidden'/> Hi, {loggedInUser}</h1>
           <p className='md:flex hover:text-blue-500 hidden'> <BiHelpCircle className='mr-2' size={24}/> Help </p>
      </div>
    </div>
  )
}

export default SearchBar
