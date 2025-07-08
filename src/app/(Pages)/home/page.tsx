'use client';
import React from 'react'
import CakeCard from '@/app/Components/CakeCard'
import SearchBar from '@/app/Components/SearchBar'
import { useState } from 'react'

const Page = () => {
      const [search, setSearch] = useState("");
  return (
    <div className='flex flex-col items-center gap-6 h-full bg-cover bg-center bg-no-repeat w-screen'
         style={{backgroundImage: "url(/purple-bg.jpg)"}}>
        <div><SearchBar search={search} setSearch={setSearch}/></div>
        <div className='mt-35'><CakeCard search={search}/></div>
    </div>
  )
}

export default Page
