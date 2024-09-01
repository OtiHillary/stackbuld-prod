'use client'
import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    // <nav className="bg-gray-800 p-4">
    //   <div className="container mx-auto flex justify-between items-center">
    //     <div className="text-white text-xl">
    //       <Link className="font-semibold" href="/">
    //         Stackbuld
    //       </Link>
    //     </div>

    //     <div className="md:hidden">
    //       <button onClick={toggleMenu} className="text-white focus:outline-none">
    //         {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
    //       </button>
    //     </div>

    //     <div className={`flex-col md:flex-row md:flex md:items-center w-full md:w-auto ${isOpen ? 'flex' : 'hidden'}`}>
    //         <Link  className={`${ pathname == '/'? 'text-[#FF8A65]': 'text-white' } hover:text-[#FF8A65] px-3 py-2 rounded-md text-sm font-medium`} href="/">
    //             Home
    //         </Link>
    //         <Link className={` ${ pathname == '/add-product'? 'text-[#FF8A65]': 'text-white' } hover:text-[#FF8A65] px-3 py-2 rounded-md text-sm font-medium` } href="/add-product">
    //             Add new Product
    //         </Link>
    //     </div>
    //   </div>
    // </nav>
    
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl">
          <Link className="font-semibold" href="/">
            Stackbuld
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            { isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <div className={`flex-col absolute top md:relative md:flex-row md:flex md:items-center w-full md:w-auto ${isOpen ? 'flex' : 'hidden'}`}>
          <Link
            className={`${
              pathname === '/' ? 'text-[#FF8A65]' : 'text-white'
            } hover:text-[#FF8A65] px-3 py-2 rounded-md text-sm font-medium`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`${
              pathname === '/add-product' ? 'text-[#FF8A65]' : 'text-white'
            } hover:text-[#FF8A65] px-3 py-2 rounded-md text-sm font-medium`}
            href="/add-product"
          >
            Add new Product
          </Link>
        </div>
      </div>
    </nav>
  );
};