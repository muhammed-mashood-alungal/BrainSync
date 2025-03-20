'use client'
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { ISessionTypes } from '@/types/sessionTypes';
import { IUserType } from '@/types/userTypes';
import CreateSession from '@/app/dashboard/sessions/CreateSession';



interface Session extends ISessionTypes {
    _id : string,
    createdBy : IUserType
}
const SessionsListing: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [iscreatOpen,setCreateOpen] = useState(false)

   
    // Sample data for sessions
    // const sessions = [
    //     { id: 1, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Done' },
    //     { id: 2, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Live' },
    //     { id: 3, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Upcoming' },
    //     { id: 4, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Done' },
    //     { id: 5, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Live' },
    //     { id: 6, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Upcoming' },
    //     { id: 7, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Done' },
    //     { id: 8, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Live' },
    //     { id: 9, title: 'Binary Search Tree', category: 'DS & algorithm', startTime: '8:00 PM', duration: '2 hr', host: 'john@gmail.com', status: 'Upcoming' },
    // ];

    const sessionsPerPage = 9;
    const totalPages = Math.ceil(sessions?.length / sessionsPerPage);


    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = sessions?.slice(indexOfFirstSession, indexOfLastSession);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Live':
                return 'text-green-500';
            case 'Upcoming':
                return 'text-yellow-500';
            case 'Done':
            default:
                return 'text-gray-400';
        }
    };

    return (
        <>

            <div className="flex flex-wrap gap-2 mb-6">
                <div className="relative flex-grow min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search sessions"
                        className="w-full bg-gray-900 text-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8979FF]"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                </div>

                <div className="relative w-full sm:w-auto">
                    <button className="bg-gray-900 text-gray-300 rounded-md px-4 py-2 flex items-center w-full sm:w-auto">
                        <span className="mr-2">Subject</span>
                        <ChevronDown size={16} />
                    </button>
                </div>

                <div className="relative w-full sm:w-auto">
                    <button className="bg-gray-900 text-gray-300 rounded-md px-4 py-2 flex items-center w-full sm:w-auto">
                        <span className="mr-2">Date</span>
                        <ChevronDown size={16} />
                    </button>
                </div>

                {/* <div className="relative w-full sm:w-auto">
                    <button
                    onClick={()=>setCreateOpen(true)}
                        className="bg-[#00D2D9] hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 w-full sm:w-auto"
                    >
                        Schedule a Session
                    </button>
                </div> */}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentSessions?.map((session) => (
                    <div
                        key={session._id}
                        className="rounded-lg overflow-hidden bg-zinc-900 border-l-4"
                        style={{ borderLeftColor: '#8979FF' }}
                    >
                        <div className="p-4">
                            <h3 className="font-semibold mb-1">{session.sessionName}</h3>
                            <p className="text-gray-400 text-sm mb-4">{session.subject}</p>

                            <div className="grid grid-cols-2  text-sm">
                                <div>
                                    <span className="text-gray-400">Start Time:</span>
                                </div>
                                <div>
                                    <span>{session?.startTime?.toLocaleString()}</span>
                                </div>

                                <div>
                                    <span className="text-gray-400">End Time:</span>
                                </div>
                                <div>
                                    <span>{session?.endTime?.toLocaleString()}</span>
                                </div>

                                <div>
                                    <span className="text-gray-400">Host:</span>
                                </div>
                                <div>
                                    <span>{session.createdBy.username}</span>
                                </div>

                                <div>
                                    <span className="text-gray-400">Status:</span>
                                </div>
                                <div>
                                    <span className={getStatusColor(session.status)}>{session.status}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button className="text-[#8979FF] hover:text-[#5a50a7]  hover:cursor-pointer text-sm">Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === index + 1
                                ? 'bg-[#8979FF] text-white'
                                : 'bg-gray-800 text-gray-400'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
       
            { iscreatOpen && <CreateSession onClose={()=>setCreateOpen(false)}/>}
           
        </>
    );
};

export default SessionsListing;