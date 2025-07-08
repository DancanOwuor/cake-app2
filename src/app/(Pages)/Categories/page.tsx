"use client"
import React,{useState} from 'react'
import CakeCard from '@/app/Components/CakeCard'
import SearchBar from '@/app/Components/SearchBar'


const Page = () => {
        const [search, setSearch] = useState("");
  
  return (
    <div className=''>
      <SearchBar search={search} setSearch={setSearch}/>
      <div className=' mt-35 md:grid md:grid-cols-[1fr_6fr] h-full'>
         <div className=' p-2 md:shadow-2xl gap-4 flex flex-col'>
            <h1 className='text-2xl font-bold text-center md:fixed'>FILTERS</h1>
            <div className='flex md:flex-col gap-3 md:fixed md:mt-10 md:top[-24px]'>
                <div className='border-2 border-gray-200 w-fit md:p-3 p-2'>
                  <h1 className='font-bold text-center'>CATEGORIES</h1>
                    <div className='flex flex-col gap-2 items-baseline pr-5'>
                      <div className='flex gap-2'><input type='checkbox'/><p>Wedding Cake</p></div>
                      <div className='flex  gap-2'><input type='checkbox'/><p>BirthDay</p></div>
                      <div className='flex  gap-2'><input type='checkbox'/>Anniversary</div>
                    </div>   
                </div>
                <div className='border-2 border-gray-200 w-fit p-3 px-6'>
                  <h1 className='font-bold'>PRICE RANGE</h1>
                    <div className='flex flex-col gap-2 items-baseline pr-5'>
                      <div className='flex gap-2'><input type='checkbox'/><p>1000-2500</p></div>
                      <div className='flex  gap-2'><input type='checkbox'/><p>2500-4000</p></div>
                      <div className='flex  gap-2'><input type='checkbox'/>4K+</div>
                    </div>   
                </div>
            </div>
            
          </div>
          <div className='w-fit mt-5 md:mt-0'>
              <CakeCard search={search}/>
          </div>
      </div>
     
    </div>
  )
}

export default Page
