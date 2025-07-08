"use client"
import React from 'react'
import AdminCakeCard from '@/app/Components/AdminCakeCards'
import SearchBar from '@/app/Components/SearchBar'
import { useState} from 'react';

const Page = () => {
    const [search, setSearch] = useState<string>("");

  return (
    <div className='flex p-3 gap-5 flex-col items-center mt-35'>
        <SearchBar search={search} setSearch={setSearch}/>
        <h1 className='text-pink-500 font-bold text-center text-3xl'>Cake Catalogue</h1>
        <AdminCakeCard search={search} />
    </div>
  )
}

export default Page
