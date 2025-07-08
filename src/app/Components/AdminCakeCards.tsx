"use client"
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'

type Cake = {
  _id:string
  name: string
  description: string
  price: string
  imageUrl: string
}
interface AdminCakeCardProps {
  search: string
}

const AdminCakeCard = ({search}: AdminCakeCardProps) => {
       const [cakes, setCakes] = useState<Cake[]>([]);
       const [editing, setEditing] = useState<string | null>(null);
       const [editedCakes, setEditedCakes] = useState<Record<string, Partial<Cake>>>({}); // state to track input changes
       const inputRefs = useRef<{ [cakeId:string]: HTMLInputElement | null}>({});

       const filteredCakes = search ? 
       (cakes.filter(cake =>cake.name.toLowerCase().includes(search.toLowerCase()) )) : cakes

  useEffect(()=>{  
            const fetchCakes = async ()=>{
                            const res = await fetch('/api/GetCakes',{
                                method: "GET",
                                headers: { "Content-Type": "application/json" }
                            })
                            const data:Cake[] = await res.json();
                            setCakes(data);
                        }
                fetchCakes();

      }, []);

  const handleDelete = async (cakeId: string) => {
          try {
            // Send a DELETE request to your API
            const res = await fetch('/api/GetCakes', {
            method: "DELETE",
            body: JSON.stringify({cakeId}),
            });
      
            if (!res.ok) toast.error("Failed to delete cake");

            if (res.ok){
                 toast.success('Cake deleted successfully!');
            // 🔥 Update the local `cakes` state after succesful deletion
                 setCakes(prevCakes => prevCakes.filter(cake => cake._id !== cakeId));
            }
          } catch (error) {
                toast.error("Error deleting cake:" + error);
                console.error("Error deleting cake:", error);
            }
          }
const handleEdit = (cakeId: string)=>{
        setEditing(prev => (prev === cakeId ? null : cakeId));
        setTimeout(()=>{
                    inputRefs.current[cakeId]?.focus();
        }, 0) //setTimeout(..., 0) ensures the input is rendered before trying to focus it.
      };
      const handleSave = async(cakeId: string)=>{
        const updatedCake = editedCakes[cakeId];
        if(!updatedCake) return;

        try{
          const res = await fetch('/api/GetCakes', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: cakeId, ...updatedCake}),
          })
           if (!res.ok) toast.error('Failed to update cake');
          
           if(res.ok){
            const data = await res.json()
            toast.success('Cake updated successfully!');
            // 🔥 Update the local `cakes` state
        setCakes(prevCakes =>
           prevCakes.map(cake =>
        cake._id === cakeId ? { ...cake, ...data.data } : cake
      )
    );
  }
        } catch(error:unknown){
           if (error instanceof Error) {
            toast.error('Failed to Update Cake');
            console.error('Failed to Update Cake')
           }
        }
       setEditing(null);

    };

  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 space-y-4 md:gap-7 w-full h-s md:p-6 p-3'>
          {filteredCakes.map((cake: Cake, index:number)=>(
          <div key={index} className=' h-[233px] md:h-[333px] w-[144px] md:w-[244px] overflow-hidden flex flex-col shadow-2xl rounded-[5px]'>
            <div className='relative h-[293px] w-[234px]'>
               <Image className='rounded-[4px] object-cover'
                  src={cake.imageUrl}
                  alt={cake.name}
                  fill
                  sizes="250px"
                  priority={index < 4}
                  />
            </div>
            <div className=' flex flex-col text-center justify-center items-center py-2 '>
              {editing!== cake._id? 
              (<div>
                    <p className='font-bold text-purple-500 md:text-2xl'>{cake.name}</p>
                    <p className='font-bold'>{cake.description}</p>
                    <p className='font-bold'>Ksh: {cake.price}</p>
                </div>
                
              ):<div className='flex flex-col text-center justify-center items-center py-2'>
                    <input ref={(el)=> {inputRefs.current[cake._id] = el}}
                       defaultValue={cake.name}
                       onChange={(e) => setEditedCakes(prev =>({
                        ...prev,
                         [cake._id]:{...prev[cake._id],
                          name:e.target.value} 
                          })
                        )}
                       className='font-bold text-purple-500 md:text-2xl w-[70%] px-2 text-center'/>

                    <input 
                        defaultValue={cake.description}
                        onChange={(e) => setEditedCakes(prev =>({
                        ...prev,
                         [cake._id]:{...prev[cake._id],
                          description:e.target.value} 
                          })
                        )}
                        className='font-bold w-[70%] px-2 text-center'/>

                    <input 
                        defaultValue={cake.price}
                         onChange={(e) => setEditedCakes(prev =>({
                        ...prev,
                         [cake._id]:{...prev[cake._id],
                          price:e.target.value} 
                          })
                        )}
                        className='font-bold w-[70%] px-2 text-center'/>
                </div>}

                <div className='flex gap-3 text-white font-bold'>
                  <button onClick={() => handleDelete(cake._id)} className='bg-red-500 h-[25px] md:h-[35px] md:w-[100px] w-[65px] hover:bg-red-600 rounded-[3px]'>Delete</button>
                  {editing !== cake._id ? (
                      <button onClick={()=> handleEdit(cake._id)} className='bg-green-500 h-[25px] md:h-[35px] md:w-[100px] w-[55px] hover:bg-green-600 rounded-[3px]'>Edit</button>
                  ) : (
                      <button onClick={()=> handleSave(cake._id)} className='bg-orange-500 h-[25px] md:h-[35px] md:w-[100px] w-[55px] hover:bg-green-600 rounded-[3px]'>Save</button>
                  )}
                </div>        
            </div>
          </div>
        ))}  
    </div>
  )
}
export default AdminCakeCard
