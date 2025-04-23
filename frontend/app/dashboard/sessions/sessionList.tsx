// "use client";
// import React, { useEffect, useState } from "react";
// import { Search, ChevronDown } from "lucide-react";
// import CreateSession from "./CreateSession";
// import { ISessionTypes, Session } from "@/types/sessionTypes";
// import { useAuth } from "@/Context/auth.context";
// import { IGroupType } from "@/types/groupTypes";
// import { useRouter } from "next/navigation";
// import BaseModal from "@/Components/Modal/Modal";
// import SessionDetailsModal from "./SessionDetails";
// import { SessionServices } from "@/services/client/session.client";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArrowUpWideShort,
//   faClose,
//   faFilter,
// } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import SimpleStudyLoading from "@/Components/Loading/Loading";
// import EmptyList from "@/Components/EmptyList/EmptyList";

// const SessionsListing: React.FC = ({}) => {
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [iscreatOpen, setCreateOpen] = useState(false);
//   const [isUpdateOpen, setUpdateOpen] = useState(false);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [sessionData, setSessionData] = useState<ISessionTypes | null>(null);
//   const [filterSubject, setFilterSubject] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [sort, setSort] = useState(false);
//   const { user } = useAuth();
//   const router = useRouter();
//   const limit = 9;
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const hash = window.location.hash;
//     if (hash === "#create") {
//       setCreateOpen(true);
//     }
//   }, []);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Live":
//         return "text-green-500";
//       case "Scheduled":
//         return "text-yellow-500";
//       case "Ended":
//         return "text-red-500";
//       default:
//         return "text-gray-400";
//     }
//   };

//   const goToRoom = (sessionCode: string) => {
//     router.push(`/sessions/${sessionCode}`);
//   };

//   const getStatus = (start: Date | string, end: Date | string) => {
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const currentDate = new Date();

//     if (startDate > currentDate) {
//       return "Scheduled";
//     }
//     if (startDate < currentDate && endDate > currentDate) {
//       return "Live";
//     }
//     if (endDate < currentDate) {
//       return "Ended";
//     }
//   };

//   const clearDateFilter = ()=>{
//     setStartDate('')
//     setEndDate('')
//   }

//   const filteredSessions = async (
//     searchQuery: string,
//     filterSubject: string,
//     startDate: string | null,
//     endDate: string | null,
//     sort: boolean,
//     skip: number,
//     limit: number
//   ) => {
//     try {
//       setLoading(true);
//       const { sessions, count } = await SessionServices.getFilteredSessions(
//         searchQuery,
//         filterSubject,
//         startDate,
//         endDate,
//         Number(sort),
//         skip,
//         limit
//       );
//       setSessions(sessions);
//       setTotalPages(Math.ceil(count / limit));
//     } catch (error) {
//       toast.error((error as Error).message);
//     }
//     setLoading(false);
//   };

//   const customDateFilter = () => {
//     if (!startDate) {
//       return toast.error("Please Select a Start Date");
//     }
//     if (!endDate) {
//       return toast.error("Please Select a end Date");
//     }
//     if (startDate > endDate) {
//       return toast.error("Please Enter a valid Range");
//     }
//     filteredSessions(
//       searchQuery,
//       filterSubject,
//       startDate,
//       endDate,
//       sort,
//       (currentPage - 1) * 10,
//       limit
//     );
//   };

  
//   useEffect(() => {
//     let filterStartDate: string | null = startDate;
//     let filterEndDate: string | null = endDate;
//     if (!filterStartDate) filterEndDate = null;
//     if (!filterEndDate) filterStartDate = null;

//     filteredSessions(
//       searchQuery,
//       filterSubject,
//       filterStartDate,
//       filterEndDate,
//       sort,
//       (currentPage - 1) * 10,
//       limit
//     );
//   }, [searchQuery, filterSubject, sort, currentPage]);

//   return (
//     <>
//       <div className="flex flex-wrap gap-2 mb-6">
//         <div className="relative flex-grow min-w-[200px]">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search sessions"
//             className="w-full bg-gray-900 text-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4">
//           {/* Subject Dropdown */}
//           <div className="relative w-full sm:w-auto">
//             <select
//               className="bg-gray-900 text-gray-300 rounded-md px-4 py-2 w-full sm:w-auto appearance-none pr-8"
//               onChange={(e) => {
//                 setFilterSubject(e.target.value);
//                 //   filteredSessions(e.target.value as string);
//               }}
//               value={filterSubject}
//             >
//               <option value="">Subject</option>
//               <option value="Mathematics">Math</option>
//               <option value="Physics">Physics</option>
//               <option value="History">History</option>
//             </select>
//             <ChevronDown
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={16}
//             />
//           </div>
//           <input
//             type="text"
//             name="startDate"
//             placeholder="Start Date"
//             value={startDate}
//             className="h-10 rounded p-2 bg-gray-900"
//             onChange={(e) => setStartDate(e.target.value)}
//             onFocus={(e) => (e.target.type = "date")}
//           />

//           <input
//             type="text"
//             name="endDate"
//             placeholder="End Date"
//             value={endDate}
//             className="h-10 rounded p-2 bg-gray-900"
//             onChange={(e) => setEndDate(e.target.value)}
//             onFocus={(e) => (e.target.type = "date")}
//           />
//           <div className="h-10 w-10 flex justify-center items-center bg-gray-900 rounded ">
//             <FontAwesomeIcon icon={faFilter} onClick={customDateFilter} />
//           </div>
//           {startDate && endDate && (
//             <div className="h-10 w-10 flex justify-center items-center bg-gray-900 rounded ">
//             <FontAwesomeIcon icon={faClose} onClick={()=>{
//               clearDateFilter()
//               filteredSessions(searchQuery, filterSubject, '' , '', sort , (currentPage - 1)*10 , limit)
//             }} />
//           </div>
//           )}
//           <div
//             className="h-10 w-10 flex justify-center items-center bg-gray-900 rounded "
//             onClick={() => setSort(!sort)}
//           >
//             <FontAwesomeIcon
//               icon={faArrowUpWideShort}
//               className={sort ? "rotate-180" : ""}
//             />
//           </div>
//         </div>

//         <div className="relative w-full sm:w-auto">
//           <button
//             onClick={() => {
//               router.push("/dashboard/sessions#create");
//               setCreateOpen(true);
//             }}
//             className="bg-[#00D2D9] hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 w-full sm:w-auto"
//           >
//             Schedule a Session
//           </button>
//         </div>
//       </div>
//       <div>{loading && <SimpleStudyLoading />}</div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {!loading &&
//           sessions?.map((session) => (
//             <div
//               key={session._id}
//               className="rounded-lg overflow-hidden bg-zinc-900 border-l-4"
//               style={{ borderLeftColor: "#00D2D9" }}
//             >
//               <div className="p-4">
//                 <div className="flex justify-between">
//                   <div>
//                     <h3 className="font-semibold mb-1">
//                       {session.sessionName}
//                     </h3>
//                     <p className="text-gray-400 text-sm mb-4">
//                       Subject : {session.subject}
//                     </p>
//                   </div>
//                   <div>
//                     {getStatus(session.startTime, session.endTime) == "Live" &&
//                       !session.isStopped && (
//                         <button
//                           className="bg-cyan-500 w-max px-4 py-1 rounded-4xl hover:cursor-pointer
//                                         hover:bg-cyan-700 transition duration-300 ease-in-out"
//                           onClick={() => goToRoom(session.code)}
//                         >
//                           Join
//                         </button>
//                       )}
//                     {session.isStopped && (
//                       <p className="text-red-500">Admin Blocked </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-1 text-sm">
//                   <div>
//                     <span className="text-gray-400">Date :</span>
//                   </div>
//                   <div>
//                     <span>{new Date(session.date).toLocaleDateString()}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-400">Start Time:</span>
//                   </div>
//                   <div>
//                     <span>
//                       {new Date(session.startTime).toLocaleTimeString()}
//                     </span>
//                   </div>

//                   <div>
//                     <span className="text-gray-400">End Time:</span>
//                   </div>
//                   <div>
//                     <span>
//                       {new Date(session.endTime).toLocaleTimeString()}
//                     </span>
//                   </div>

//                   <div>
//                     <span className="text-gray-400">Host:</span>
//                   </div>
//                   <div>
//                     <span>{session.createdBy?.username}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-400">Group:</span>
//                   </div>
//                   <div>
//                     <span>{(session.groupId as IGroupType)?.name}</span>
//                   </div>

//                   <div>
//                     <span className="text-gray-400">Status:</span>
//                   </div>
//                   <div>
//                     <span
//                       className={getStatusColor(
//                         getStatus(session.startTime, session.endTime) as string
//                       )}
//                     >
//                       {getStatus(session.startTime, session.endTime)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <button
//                     className="text-cyan-400 hover:text-cyan-300 text-md m-2 hover:cursor-pointer"
//                     onClick={() => {
//                       setIsDetailsOpen(true);
//                       setSessionData(session);
//                     }}
//                   >
//                     Details
//                   </button>

//                   {session?.createdBy?._id == user?.id &&
//                     new Date(session.endTime) > new Date() &&
//                     getStatus(
//                       session.startTime as Date,
//                       session.endTime as Date
//                     ) == "Scheduled" && (
//                       <button
//                         className="text-[#abcdff] hover:text-white text-md m-2 hover:cursor-pointer"
//                         onClick={() => {
//                           setUpdateOpen(true);
//                           setSessionData(session);
//                         }}
//                       >
//                         Edit
//                       </button>
//                     )}
//                 </div>
//               </div>
//             </div>
//           ))}
//           {!loading && sessions.length <= 0 &&  <EmptyList/>}
//       </div>

//       <div className="flex justify-center mt-8">
//         <div className="flex space-x-2">
//           {!loading &&
//             Array.from({ length: totalPages-1 }).map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentPage(index + 1)}
//                 className={`w-8 h-8 flex items-center justify-center rounded-md ${
//                   currentPage === index + 1
//                     ? "bg-cyan-500 text-white"
//                     : "bg-gray-800 text-gray-400"
//                 }`}
//               >
//                 {index + 1}
//               </button>
//             ))}
//         </div>
//       </div>
//       <BaseModal
//         isOpen={isDetailsOpen}
//         onClose={() => {
//           setIsDetailsOpen(false);
//           setSessionData(null);
//         }}
//         title="Session Details"
//       >
//         <SessionDetailsModal session={sessionData} />
//       </BaseModal>

//       {iscreatOpen && (
//         <CreateSession
//           onClose={(newSession?: Session) => {
//             setCreateOpen(false);
//             router.push("/dashboard/sessions");
//             if (newSession) {
//               setSessions((prev) => {
//                 return [...prev, newSession];
//               });
//             }
//           }}
//           type={"create"}
//           data={null}
//         />
//       )}
//       {isUpdateOpen && (
//         <CreateSession
//           onClose={(newSession?: Session) => {
//             if (newSession) {
//               setSessions((prev) => {
//                 return prev.map((s) => {
//                   return s._id == sessionData?._id ? newSession : s;
//                 });
//               });
//             }
//             setUpdateOpen(false);
//             setSessionData(null);
//           }}
//           type={"update"}
//           data={sessionData}
//         />
//       )}
//     </>
//   );
// };

// export default SessionsListing;
// SessionsListing.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ISessionTypes, Session } from "@/types/sessionTypes";
import { useAuth } from "@/Context/auth.context";
import { IGroupType } from "@/types/groupTypes";
import { useRouter } from "next/navigation";
import BaseModal from "@/Components/Modal/Modal";
import SessionDetailsModal from "./SessionDetails";
import { SessionServices } from "@/services/client/session.client";
import CreateSession from "./CreateSession";
import GenericListing from "@/Components/SessionListing/SessionListing";


const SessionsListing: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [iscreatOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sessionData, setSessionData] = useState<ISessionTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const limit = 9;

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#create") {
      setCreateOpen(true);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "text-green-500";
      case "Scheduled":
        return "text-yellow-500";
      case "Ended":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const goToRoom = (sessionCode: string) => {
    router.push(`/sessions/${sessionCode}`);
  };

  const getStatus = (start: Date | string, end: Date | string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date();

    if (startDate > currentDate) {
      return "Scheduled";
    }
    if (startDate < currentDate && endDate > currentDate) {
      return "Live";
    }
    if (endDate < currentDate) {
      return "Ended";
    }
  };

  const fetchFilteredSessions = async (
    searchQuery: string,
    filterSubject: string,
    startDate: string | null,
    endDate: string | null,
    sort: boolean,
    skip: number,
    limit: number
  ) => {
    const { sessions, count } = await SessionServices.getFilteredSessions(
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
        style={{ borderLeftColor: "#00D2D9" }}
      >
        <div className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold mb-1">{session.sessionName}</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subject : {session.subject}
              </p>
            </div>
            <div>
              {getStatus(session.startTime, session.endTime) == "Live" &&
                !session.isStopped && (
                  <button
                    className="bg-cyan-500 w-max px-4 py-1 rounded-4xl hover:cursor-pointer
                                hover:bg-cyan-700 transition duration-300 ease-in-out"
                    onClick={() => goToRoom(session.code)}
                  >
                    Join
                  </button>
                )}
              {session.isStopped && (
                <p className="text-red-500">Admin Blocked </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-sm">
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
              <span>{session.createdBy?.username}</span>
            </div>
            <div>
              <span className="text-gray-400">Group:</span>
            </div>
            <div>
              <span>{(session.groupId as IGroupType)?.name}</span>
            </div>

            <div>
              <span className="text-gray-400">Status:</span>
            </div>
            <div>
              <span
                className={getStatusColor(
                  getStatus(session.startTime, session.endTime) as string
                )}
              >
                {getStatus(session.startTime, session.endTime)}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <button
              className="text-cyan-400 hover:text-cyan-300 text-md m-2 hover:cursor-pointer"
              onClick={() => {
                setIsDetailsOpen(true);
                setSessionData(session);
              }}
            >
              Details
            </button>

            {session?.createdBy?._id == user?.id &&
              new Date(session.endTime) > new Date() &&
              getStatus(session.startTime as Date, session.endTime as Date) ==
                "Scheduled" && (
                <button
                  className="text-[#abcdff] hover:text-white text-md m-2 hover:cursor-pointer"
                  onClick={() => {
                    setUpdateOpen(true);
                    setSessionData(session);
                  }}
                >
                  Edit
                </button>
              )}
          </div>
        </div>
      </div>
    );
  };

  const handleCreateClick = () => {
    router.push("/dashboard/sessions#create");
    setCreateOpen(true);
  };

  const filterOptions = [
    { value: "Mathematics", label: "Math" },
    { value: "Physics", label: "Physics" },
    { value: "History", label: "History" },
  ];

  return (
    <>
      <GenericListing
        items={sessions}
        setItems={setSessions}
        renderCard={renderSessionCard}
        fetchData={fetchFilteredSessions}
        onCreateClick={handleCreateClick}
        createButtonText="Schedule a Session"
        filterOptions={filterOptions}
        filterLabel="Subject"
        searchPlaceholder="Search sessions"
        showDateFilter={true}
        loading={loading}
        setLoading={setLoading}
        limit={limit}
      />

      <BaseModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSessionData(null);
        }}
        title="Session Details"
      >
        <SessionDetailsModal session={sessionData} />
      </BaseModal>

      {iscreatOpen && (
        <CreateSession
          onClose={(newSession?: Session) => {
            setCreateOpen(false);
            router.push("/dashboard/sessions");
            if (newSession) {
              setSessions((prev) => {
                return [...prev, newSession];
              });
            }
          }}
          type={"create"}
          data={null}
        />
      )}
      {isUpdateOpen && (
        <CreateSession
          onClose={(newSession?: Session) => {
            if (newSession) {
              setSessions((prev) => {
                return prev.map((s) => {
                  return s._id == sessionData?._id ? newSession : s;
                });
              });
            }
            setUpdateOpen(false);
            setSessionData(null);
          }}
          type={"update"}
          data={sessionData}
        />
      )}
    </>
  );
};

export default SessionsListing;