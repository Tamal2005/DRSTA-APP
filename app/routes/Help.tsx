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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult("Sending...");

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
    }
  };
  return (
    <div id='help' className="w-full text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
      <div className="mx-auto p-4 flex justify-between bg-opacity-80 rounded-lg">
        <div className="max-w-lg mx-auto font-mono w-full bg-opacity-80 p-6 rounded-lg shadow-lg cursor-default">
          <form onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold mb-4 text-teal-700">Help Desk Support</h2>

            <p className="text-gray-700 mb-6 text-left">
              <li className='right-2 p-2'>Facing an error or have a suggestion?</li>
              <li className='right-2 p-2'>Fill out the form below and we will try to modify it.</li>
            </p>

            <div className="mb-4">
              <input onChange={(e) => setName(e.target.value)} type="text" name="name" autoComplete='name' className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" id="cilentName" placeholder="Your Name" required />
            </div>

            <div className="mb-4">
              <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" autoComplete='email' className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" id="clientEmail1" placeholder="Your Email Id" required />
              <p className="text-sm text-gray-600 mt-1 block">We'll never share your email with anyone else.</p>
            </div>

            <div className="mb-4">
              <textarea onChange={(e) => setMessage(e.target.value)} name="message" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" id="myBox" rows={4} placeholder="Write Message" required></textarea>
            </div>

            <button type="submit" className="w-24 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
              Submit
            </button>
          </form>

          <PopUpHelp isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} messageInfo={messageInfo} loading={false} />

        </div>
      </div>
    </div>
  )
}
