'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import NoteListing from './NoteListing';
import { INoteTypes } from '@/types/note.types';
import { noteInstances } from '@/axios/createInstance';
import { noteServices } from '@/services/client/note.client';


export default function Resources() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false)
    const [notes, setNotes] = useState<INoteTypes[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 8
    const [totalPages, setTotalPage] = useState(1 / limit)

    useEffect(() => {
        async function fetchMyNotes() {
            const { notes, count } = await noteServices.myNotes(searchTerm, (currentPage - 1) * limit, limit)
            setTotalPage(Math.ceil(count / limit))
            setNotes(notes)
        }
        fetchMyNotes()
    }, [searchTerm , currentPage , totalPages])

    return (
        <div className="flex-1 min-h-screen bg-[#1E1E1E] text-white px-6  ml-1">
            <div className="max-w-7xl mx-auto">
                {/* Header with search */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Resources</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search sessions"
                            className="bg-transparent border border-gray-600 rounded-full py-2 px-4 w-64 focus:outline-none focus:border-teal-500"
                        />
                        {/* <div className="absolute right-3 top-2.5">
              <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                <Image src="/placeholder/avatar" alt="User" width={24} height={24} className="object-cover" />
              </div>
            </div> */}
                    </div>
                </div>

                {/* Filters row */}
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by Note Name"
                        className="bg-transparent border border-gray-600 rounded-full py-2 px-4 w-64 focus:outline-none focus:border-teal-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Sort dropdown */}
                    {/* <div className="relative">
            <button 
              className="bg-transparent border border-gray-600 rounded-full py-2 px-4 flex items-center gap-2 focus:outline-none"
              onClick={() => setSortOpen(!sortOpen)}
            >
              Sort
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
            {sortOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Name</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Date (Newest)</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Date (Oldest)</li>
                </ul>
              </div>
            )}
          </div> */}

                    {/* Filter dropdown */}
                    {/* <div className="relative">
            <button 
              className="bg-transparent border border-gray-600 rounded-full py-2 px-4 flex items-center gap-2 focus:outline-none"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              Filter
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
            {filterOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">All Resources</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Boards</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Notes</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Code</li>
                </ul>
              </div>
            )}
          </div>*/}
                </div>


                <NoteListing notes={notes} />
                <div className="flex justify-center items-center my-3">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-gray-300 mx-5">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>


                {/* Table header */}
                {/* <div className="grid grid-cols-4 gap-4 py-4 text-gray-400 border-b border-gray-800">
          <div>Name</div>
          <div>Date Edited</div>
          <div>Session</div>
          <div>Created By</div>
        </div> */}

                {/* Table rows */}
                {/* {notes.map((resource) => (
          <div
            key={resource.id} 
            className="grid grid-cols-4 gap-4 py-4 border-b border-gray-800 hover:bg-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="text-teal-500">
                {resource.type === 'board' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-5 h-5">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2z"/>
                    <path d="M3 3h2v2H3zm0 3h2v2H3zm0 3h2v2H3zm3-6h2v2H6zm0 3h2v2H6zm0 3h2v2H6zm3-6h2v2H9zm0 3h2v2H9zm0 3h2v2H9zm3-6h2v2h-2zm0 3h2v2h-2zm0 3h2v2h-2z"/>
                  </svg>
                )}
                {resource.type === 'note' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-5 h-5">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                )}
                {resource.type === 'code' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-5 h-5">
                    <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
                  </svg>
                )}
              </div>
              <span>{resource.name}</span>
            </div>
            <div>{resource.dateEdited}</div>
            <div>{resource.session}</div>
            <div>{resource.createdBy}</div>
          </div>
        ))} */}
            </div>
        </div>
    );
}