import React, { useState } from 'react'
import axios from 'axios';
import PopUpHelp from './PopUpHelp';

export default function Help() {
  const [result, setResult] = React.useState("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<{ result: string | null }>({ result: null });
  const [isCalculating, setIsCalculating] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult("Sending...");
    setIsCalculating(true);

    try {
      const res = await axios.post("https://fast-email-api-alpha.vercel.app/contact", {
        Name: name,
        Email: email,
        Message: message,
      });

      const data = res.data;

      setMessageInfo({ result: data.success ? "Your form has been successfully submitted." : "Something went wrong." })

      if (data.success) {
        setResult("Your form has been successfully submitted.");
        setIsPopupOpen(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setResult("Something went wrong.");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setResult("Submission failed.");
      setIsPopupOpen(true);
    } finally {
      setIsCalculating(false);
    }
  };
  return (
    <div id='contact' className="w-full px-[12%] py-10 mt-15">
            <h2 className="text-center text-3xl font-bold mb-4 text-teal-700">Help Desk Support</h2>

            <p className="text-gray-700 mb-6 text-left">
              <li className='right-2 p-2'>Facing an error or have a suggestion?</li>
              <li className='right-2 p-2'>Fill out the form below and we will try to modify it.</li>
            </p>
            <form className='mx-w-2xl mx-auto' onSubmit={onSubmit}>
                <div className='grid grid-cols-2 gap-5 mt-10 mb-8'>
                    <input onChange={(e) => setName(e.target.value)} name='name' type="text" placeholder="Enter Your Name" className='flex-1 p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white' required />
                    <input onChange={(e) => setEmail(e.target.value)} name='email' type="email" placeholder="Enter Your Email" className='flex-1 p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white' required />
                </div>
                <textarea onChange={(e) => setMessage(e.target.value)} name='message' rows={6} placeholder='Enter Your Message' className='w-full p-4 outline-none border-[0.5px] border-gray-400 rounded-md bg-white mb-6' required></textarea>

                <button disabled={isCalculating} type="submit" className='py-3 px-8 w-max flex items-center justify-between gap-2 bg-black/80 text-white rounded-full mx-auto hover:bg-black duration-500'>Submit Now</button>
            </form>

            {isCalculating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl max-w-sm mx-4">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Submitting your form.</h3>
                            <p className="text-xs text-gray-500 mt-2">This may take a moment</p>
                        </div>
                    </div>
                </div>
            )}

            <PopUpHelp isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} messageInfo={messageInfo} loading={isCalculating}/>

        </div>
  )
}
