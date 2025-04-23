// 'use client'
// import React, { useState } from 'react';
// import { Search, ChevronDown, StopCircle } from 'lucide-react';
// import { ISessionTypes } from '@/types/sessionTypes';
// import { IUserType } from '@/types/userTypes';
// import CreateSession from '@/app/dashboard/sessions/CreateSession';
// import { IGroupType } from '@/types/groupTypes';
// import Confirm from '@/Components/ConfirmModal/ConfirmModal';
// import { SessionServices } from '@/services/client/session.client';



// interface Session extends ISessionTypes {
//     _id: string,
//     createdBy: IUserType
// }
// const SessionsListing: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
//     const [currentPage, setCurrentPage] = useState(1)
//     const [selectedSession, setSelectedSession] = useState('')


//     const sessionsPerPage = 9;
//     const totalPages = Math.ceil(sessions?.length / sessionsPerPage);


//     const indexOfLastSession = currentPage * sessionsPerPage;
//     const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
//     const currentSessions = sessions?.slice(indexOfFirstSession, indexOfLastSession);

//     // Change page
//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//     // Get status color
//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'Live':
//                 return 'text-green-500';
//             case 'Upcoming':
//                 return 'text-yellow-500';
//             case 'Done':
//             default:
//                 return 'text-gray-400';
//         }
//     }

//     const getStatus = (start: Date | string, end: Date | string) => {
//         const startDate = new Date(start)
//         const endDate = new Date(end)
//         const currentDate = new Date()

//         if (startDate > currentDate) {
//             return 'Scheduled'
//         }
//         if (startDate < currentDate && endDate > currentDate) {
//             return 'Live'
//         }
//         if (endDate < currentDate) {
//             return 'Ended'
//         }
//     }

//     const handleStopSession = async () => {
//         try {
//             await SessionServices.stopSession(selectedSession , )
//         } catch (error) {
//         } finally {
//             setSelectedSession('')
//         }
//     }

//     return (
//         <>

//             <div className="flex flex-wrap gap-2 mb-6">
//                 <div className="relative flex-grow min-w-[200px]">
//                     <input
//                         type="text"
//                         placeholder="Search sessions"
//                         className="w-full bg-gray-900 text-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8979FF]"
//                     />
//                     <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
//                 </div>

//                 <div className="relative w-full sm:w-auto">
//                     <button className="bg-gray-900 text-gray-300 rounded-md px-4 py-2 flex items-center w-full sm:w-auto">
//                         <span className="mr-2">Subject</span>
//                         <ChevronDown size={16} />
//                     </button>
//                 </div>

//                 <div className="relative w-full sm:w-auto">
//                     <button className="bg-gray-900 text-gray-300 rounded-md px-4 py-2 flex items-center w-full sm:w-auto">
//                         <span className="mr-2">Date</span>
//                         <ChevronDown size={16} />
//                     </button>
//                 </div>

//                 {/* <div className="relative w-full sm:w-auto">
//                     <button
//                     onClick={()=>setCreateOpen(true)}
//                         className="bg-[#00D2D9] hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 w-full sm:w-auto"
//                     >
//                         Schedule a Session
//                     </button>
//                 </div> */}
//             </div>


//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {currentSessions?.map((session) => (
//                     <div
//                         key={session._id}
//                         className="rounded-lg overflow-hidden bg-zinc-900 border-l-4"
//                         style={{ borderLeftColor: '#8979FF' }}
//                     >
//                         <div className="p-4">
//                             <div className='flex justify-between'>
//                                 <div>
//                                     <h3 className="font-semibold mb-1">{session.sessionName}</h3>
//                                     <p className="text-gray-400 text-sm mb-4">{session.subject}</p>
//                                 </div>
//                                     {
//                                         session.isStopped && <p className='text-red-500'>Admin Blocked </p>
//                                     }
//                                 <p>{getStatus(session.startTime, session.endTime) == 'Live' &&
//                                     <StopCircle color='red' onClick={() => setSelectedSession(session._id)} />}
//                                 </p>
//                             </div>


//                             <div className="grid grid-cols-2  text-sm">
//                                 <div >
//                                     <span className="text-gray-400">Date :</span>
//                                 </div>
//                                 <div>
//                                     <span>{new Date(session.date).toLocaleDateString()}</span>
//                                 </div>
//                                 <div >
//                                     <span className="text-gray-400">Start Time:</span>
//                                 </div>
//                                 <div>
//                                     <span>{new Date(session.startTime).toLocaleTimeString()}</span>
//                                 </div>

//                                 <div>
//                                     <span className="text-gray-400">End Time:</span>
//                                 </div>
//                                 <div>
//                                     <span>{new Date(session.endTime).toLocaleTimeString()}</span>
//                                 </div>

//                                 <div>
//                                     <span className="text-gray-400">Host:</span>
//                                 </div>
//                                 <div>
//                                     <span>{session.createdBy.username}</span>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-400">Group:</span>
//                                 </div>
//                                 <div>
//                                     <span>{(session.groupId as IGroupType).name}</span>
//                                 </div>

//                                 <div>
//                                     <span className="text-gray-400">Status:</span>
//                                 </div>
//                                 <div>
//                                     <span className={getStatusColor(getStatus(session.startTime, session.endTime) as string)}>{getStatus(session.startTime, session.endTime)}</span>
//                                 </div>
//                             </div>

//                             <div className="mt-4">
//                                 <button className="text-[#8979FF] hover:text-[#5a50a7]  hover:cursor-pointer text-sm">Details</button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <Confirm isOpen={Boolean(selectedSession)} onClose={() => setSelectedSession('')} onConfirm={handleStopSession}>

//             </Confirm>

//             <div className="flex justify-center mt-8">
//                 <div className="flex space-x-2">
//                     {Array.from({ length: totalPages }).map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => paginate(index + 1)}
//                             className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === index + 1
//                                 ? 'bg-[#8979FF] text-white'
//                                 : 'bg-gray-800 text-gray-400'
//                                 }`}
//                         >
//                             {index + 1}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//         </>
//     );
// };

// export default SessionsListing;

'use client'
import React, { useState } from 'react';
import { StopCircle } from 'lucide-react';
import { ISessionTypes } from '@/types/sessionTypes';
import { IUserType } from '@/types/userTypes';
import { IGroupType } from '@/types/groupTypes';
import Confirm from '@/Components/ConfirmModal/ConfirmModal';
import { SessionServices } from '@/services/client/session.client';
import GenericListing from '@/Components/SessionListing/SessionListing';


interface Session extends ISessionTypes {
    _id: string,
    createdBy: IUserType
}

const AdminSessionsListing: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [loading, setLoading] = useState(false);

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Live':
                return 'text-green-500';
            case 'Scheduled':
                return 'text-yellow-500';
            case 'Ended':
                default:
                return 'text-gray-400';
        }
    }

    const getStatus = (start: Date | string, end: Date | string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const currentDate = new Date();

        if (startDate > currentDate) {
            return 'Scheduled';
        }
        if (startDate < currentDate && endDate > currentDate) {
            return 'Live';
        }
        if (endDate < currentDate) {
            return 'Ended';
        }
    }

    const handleStopSession = async () => {
        try {
            await SessionServices.stopSession(selectedSession);
            // Update the sessions list after stopping a session
            setSessions(prevSessions => 
                prevSessions.map(session => 
                    session._id === selectedSession 
                        ? { ...session, isStopped: true } 
                        : session
                )
            );
        } catch (error) {
            console.error("Error stopping session:", error);
        } finally {
            setSelectedSession('');
        }
    }

  const fetchFilteredSessions = async (
      searchQuery: string,
      filterSubject: string,
      startDate: string | null,
      endDate: string | null,
      sort: boolean,
      skip: number,
      limit: number
    ) => {
      const { sessions, count } = await SessionServices.getAllSessions(
        searchQuery,
        filterSubject,
        startDate,
        endDate,
        Number(sort),
        skip,
        limit
      );
      return { items: sessions, count };
    };
  

    const renderSessionCard = (session: Session) => {
        return (
            <div
                key={session._id}
                className="rounded-lg overflow-hidden bg-zinc-900 border-l-4"
                style={{ borderLeftColor: '#8979FF' }}
            >
                <div className="p-4">
                    <div className='flex justify-between'>
                        <div>
                            <h3 className="font-semibold mb-1">{session.sessionName}</h3>
                            <p className="text-gray-400 text-sm mb-4">{session.subject}</p>
                        </div>
                        {
                            session.isStopped && <p className='text-red-500'>Admin Blocked </p>
                        }
                        <p>{getStatus(session.startTime, session.endTime) === 'Live' &&
                            <StopCircle color='red' onClick={() => setSelectedSession(session._id)} 
                            className="hover:cursor-pointer" />}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 text-sm">
                        <div>
                            <span className="text-gray-400">Date :</span>
                        </div>
                        <div>
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Start Time:</span>
                        </div>
                        <div>
                            <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                        </div>

                        <div>
                            <span className="text-gray-400">End Time:</span>
                        </div>
                        <div>
                            <span>{new Date(session.endTime).toLocaleTimeString()}</span>
                        </div>

                        <div>
                            <span className="text-gray-400">Host:</span>
                        </div>
                        <div>
                            <span>{session.createdBy.username}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Group:</span>
                        </div>
                        <div>
                            <span>{(session.groupId as IGroupType).name}</span>
                        </div>

                        <div>
                            <span className="text-gray-400">Status:</span>
                        </div>
                        <div>
                            <span className={getStatusColor(getStatus(session.startTime, session.endTime) as string)}>
                                {getStatus(session.startTime, session.endTime)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button className="text-[#8979FF] hover:text-[#5a50a7] hover:cursor-pointer text-sm">
                            Details
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const filterOptions = [
        { value: "Mathematics", label: "Math" },
        { value: "Physics", label: "Physics" },
        { value: "History", label: "History" },
        // Add more subjects as needed
    ];

    return (
        <>
            <GenericListing
                items={sessions}
                setItems={setSessions}
                renderCard={renderSessionCard}
                fetchData={fetchFilteredSessions}
                filterOptions={filterOptions}
                filterLabel="Subject"
                searchPlaceholder="Search sessions"
                showDateFilter={true}
                showCreateButton={false} 
                loading={loading}
                setLoading={setLoading}
                limit={9}
            />

            <Confirm 
                isOpen={Boolean(selectedSession)} 
                onClose={() => setSelectedSession('')} 
                onConfirm={handleStopSession}
                
           />
        </>
    );
};

export default AdminSessionsListing;