"use client";
import React,{useState, useRef, useEffect} from 'react'
import { useSearchParams, useRouter } from 'next/navigation';  // needs a suspence boudary hence why we had to create a separate page for it
import { toast } from 'sonner';

interface tempUserData {
  username: string;
  email: string;
  password: string;
  role: string;
}

const EmailVerificationClient = () => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '']); //array for storing the 5 digit code
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); //to control focus on each input box
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); //getting email from query parameters
  const [tempUserData, setTempUserData] = useState<tempUserData[]>([]);

  useEffect(()=>{
    const data = sessionStorage.getItem('tempUserData');
    if (data) setTempUserData(JSON.parse(data));
  }, []);
  
  const handleVerify = async()=>{
      const code = digits.join(''); //Combine digits into one string
      if (code.length !== 5 || !email) {
      toast.error("Please enter a 5-digit code")
      console.log(tempUserData)
      return;
    }
    
    setIsVerifying(true);

    try{
      const res = await fetch('/api/verify-code', {  //takes the email fotten from the search parameters and sends it to the verify api
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      // First check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      if (!res.ok) toast.error(data.error || 'Invalid or expired code');

      // 2. Retrieve temp user data

      //create the account after success verification code match
      const CreateUser = await fetch("/api/users", {  //Sends signUp data to the users Sign up Api
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempUserData),
      })
      
     if (CreateUser.ok) {
        sessionStorage.removeItem('tempUserData');
        toast.success("User successfully created")
        router.push('/login?verified=true');
     }
    } catch(error:unknown){
       if (error instanceof Error) {
      toast.error("Verification failed " + error)
      console.error(error)
       }
    } finally {
      setIsVerifying(false);
    }
  }
  const handleChange = (index: number, value: string)=>{
    const newDigits = [...digits]; //newDigits makes a copy of the digits array
    newDigits[index] = value; //update digit at current index
    setDigits(newDigits);

  if (value && index < 4) {
    inputRefs.current[index + 1]?.focus();
  }
}
  const handleKeyDown = (index: number, e:React.KeyboardEvent)=>{
    if(e.key === 'BackSpace' && !digits[index] && index > 0){
      inputRefs.current[index-1]?.focus();
    }
    
  };

  const handlePaste = (e: React.ClipboardEvent) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData('text').slice(0, 5); // Get first 5 digits
  
  if (/^\d+$/.test(pastedData)) { // Check if pasted data is numeric
    const newDigits = [...digits];
    pastedData.split('').forEach((char, i) => {
      if (i < 5) newDigits[i] = char; // Fill boxes with pasted digits
    });
    setDigits(newDigits);
  }
};
  return (
    <div className='flex items-center justify-center h-screen w-screen border-2 border-black'>
      <div className='relative rounded-[8px] w-[750px] h-[300px] bg-gray-300 flex flex-col items-center justify-center '>
        <h1 className=' absolute top-1 text-center font-bold md:text-2xl mb-4 text-red-600'>Verify Your Email</h1>
        <h1 className=' absolute top-7 text-center md:font-bold md:text-[18px] text-sm'>Enter the Verification Code sent to {email}</h1>
        <div className='flex gap-4'>
           {digits.map((digit, index) => (
            <input
             key={index}
             type="text"
             
             maxLength={1}
             value={digit}
             onChange={(e) => handleChange(index, e.target.value)}
             onKeyDown={(e) => handleKeyDown(index, e)}
             onPaste={handlePaste}
             disabled={isVerifying} 
             className='h-[35px] bg-white w-[35px] rounded-[4px] flex text-center text-3xl focus:border-2 focus:border-green-500'/>
            ))}
        </div>  
        <button onClick={handleVerify}
        className='mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'>
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>     
      </div>
    </div>
  )
}

export default EmailVerificationClient
