"use client"
import React, { useEffect, useState } from 'react'

type User = {
  _id:string
  username: string
  role: string
  email: string
  createdAt: string
}
interface AdminUserCardProps {
  search: string
  onDelete: (id: string) => void;
}

const AdminUsercards = ({search, onDelete}: AdminUserCardProps) => {
     const [users, setUsers] = useState<User[]>([])
     const filteredUsers = search ? 
       (users.filter(user =>user.username.toLowerCase().includes(search.toLowerCase()) )) : users
    useEffect(()=>{
        const fetchUsers = async ()=>{
                    const res = await fetch('/api/users',{
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    })
                    const data:User[] = await res.json();
                    setUsers(data);
                }
        fetchUsers()
    },[])

  return (
    <div className='flex flex-col gap-4 w-screen mt-26 px-5'>
          <h1 className='text-center text-3xl font-bold'>Registered Accounts</h1>
          <div className='md:flex flex flex-col gap-5'>
              {filteredUsers.map((user:User, index:number) => ( <div key={index} className=' bg-blue-950 shadow-2xl text-white p-3 rounded-2xl flex flex-col gap-2 justify-center text-center'>
            <p className='text-center text-3xl font-extrabold'>{user.username}</p>
            <p className='text-center font-bold'>Role: {user.role}</p>
            <p>Email: {user.email}</p>
            <p>DateCreated: {new Date(user.createdAt).toLocaleDateString('en-GB',   //formating the date object from the user schema
              {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
              }
            )}
            </p>
              <div className='flex gap-3'>
                <button onClick={() => onDelete(user._id)} className='bg-red-500 rounded-[4px] p-2 hover:bg-red-400 w-[120px]'>Delete</button>
                <button className='bg-white text-black rounded-[4px] p-2  hover:bg-gray-200 w-[120px]'>Change role</button>
              </div>   
            </div>))}
           
          </div>
            
    </div>
  )
}
export default  AdminUsercards
