import Image from 'next/image'
import React from 'react'

const Search = () => {
  return (
        <div className="flex gap-3 bg-gray-800 p-4 m-2 rounded-full">
            <Image src="/icons/search.svg" alt="Search" width={30} height={30} />
            <input type="text" placeholder="Search" className="bg-transparent outline-none" />
        </div>
  )
}

export default Search