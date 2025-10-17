import { Moon, Sun } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router';

export default function Navbar() {
    const [isScroll, setIsScroll] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (scrollY > 50) {
                setIsScroll(true)
            } else {
                setIsScroll(false)
            }
        })
    }, [])
    return (
        <>
            <nav className="w-full fixed top-0 left-0 px-3 lg:px-8 xl:px-[8%] py-4 flex items-center justify-center z-50">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <ul className={`flex items-center gap-4 rounded-full md:px-8 md:py-2.5 lg:px-12 lg:py-2.5 backdrop-blur-lg shadow-sm transition-all duration-300 ${isScroll ? "" : "bg-opacity-80"}`} style={{ backgroundColor: "#f6f2efa4"}}>
                        <Link to="/"><li className="md:px-2 md:py-2 lg:px-2.5 lg:py-2.5 font-semibold rounded-full transition">Home</li></Link>
                        <Link to="/mappage"><li className="md:px-2 md:py-2 lg:px-2.5 lg:py-2.5 font-semibold rounded-full transition">Map</li></Link>
                        <Link to="/help"><li className="md:px-2 md:py-2 lg:px-2.5 lg:py-2.5 font-semibold rounded-full transition">Help</li></Link>
                    </ul>
                </div>

                {/* Mobile Navigation */}
                <div className='md:hidden w-full flex items-center justify-center gap-3'>
                    <ul className={`flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-lg shadow-sm transition-all duration-300 ${isScroll ? "" : "bg-opacity-80"}`} style={{ backgroundColor: "#f6f2efa4"}}>
                        <Link to="/"><li className='px-2 py-2 rounded-full text-sm font-semibold transition'>Home</li></Link>
                        <Link to="/mappage"><li className='px-2 py-2 rounded-full text-sm font-semibold transition'>Map</li></Link>
                        <Link to="/help"><li className='px-2 py-2 rounded-full text-sm font-semibold transition'>Help</li></Link>
                    </ul>
                </div>
            </nav>

        </>
    )
}
