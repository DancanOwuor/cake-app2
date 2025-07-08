"use client";
import React, {useState} from 'react'
import AdminUsercards from '@/app/Components/Admin-usercards'
import SearchBar from '@/app/Components/SearchBar'
import { toast } from 'sonner';

const Page = () => {
        const [search, setSearch] = useState<string>("");
        const handleDelete = async (id: string) => {
          try {
            // Send a DELETE request to your API
            const res = await fetch(`/api/users?id=${id}`, {
              method: "DELETE",
            });

            if (!res.ok) toast.error("Failed to delete User");
            // Optionally, you can refetch the cakes or update state locally
            toast.success("User deleted successfully!");
          } catch (error) {
            console.error("Error deleting User:", error);
          }
  };
        
  return (
    <div className='flex p-1 gap-3 flex-col items-center w-screen bg-gray-200 h-screen'>
      <SearchBar search={search} setSearch={setSearch}/>
      <h1 className='text-pink-500 font-bold text-center text-3xl'>{"User's Catalogue"}</h1>
        <AdminUsercards search={search} onDelete={handleDelete}/>
    </div>
  )
}

export default Page
