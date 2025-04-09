'use client'
import React, { useState, useEffect } from 'react'
import BaseModal from '@/Components/Modal/Modal'
import { toast } from 'react-hot-toast'
import Confirm from '@/Components/ConfirmModal/ConfirmModal'
import { AdminServices } from '@/services/client/admin.client'
import { IUserType } from '@/types/userTypes'
import Table from '@/Components/Table/Table'


function StudentList({ initialStudents  ,totalCount}: { initialStudents: IUserType[]  ,totalCount : number}) {

    const [students, setStudents] = useState<IUserType[]>(initialStudents)
    const [selectedStudent, setSelectedStudent] = useState<IUserType | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [loading , setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [blockingStudent, setblockingStudents] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 8
    const [totalPages , setTotalPage] = useState(totalCount / limit)
    

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true)
            try {
                const {students , count} = await AdminServices.getAllStudents((currentPage - 1)*limit ,limit , searchQuery )
                setTotalPage( Math.ceil(count / limit))
                setStudents(students)
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error("An unexpected error occurred.")
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents()
        setIsLoading(false)
    }, [currentPage , searchQuery])

    

    const blockOrUnblock = async () => {
        try {
            let studentId = blockingStudent
            await AdminServices.blockOrUnBlockStudent(studentId)
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student._id === studentId
                        ? { ...student, isAcitve: !student.isAcitve }
                        : student
                )
            )
            setblockingStudents('')

            // toast.success(`User ${currentStatus ? 'blocked' : 'unblocked'} successfully`);
        } catch (error) {
            console.error('Failed to update user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const handleViewStudent = (student: IUserType) => {
        setSelectedStudent(student)
        setIsViewModalOpen(true)
    };

    const filteredStudents = students.filter(student =>
        student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )


    

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Students Management</h1>
                <div className="w-full md:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#8979FF]"
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </div>
                </div>
            </div>


            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
                <Table
                    columns={[
                        {
                            key: "username",
                            label: "User",
                            render: (student: IUserType) => (
                                <div className="flex items-center">
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={student.profilePicture?.url || "/profilePic.png"}
                                        alt={student.username}
                                    />
                                    <div className="ml-4 text-sm font-medium text-white">{student.username}</div>
                                </div>
                            ),
                        },
                        { key: "email", label: "Email" },
                        {
                            key: "createdAt",
                            label: "Joined Date",
                            render: (student: IUserType) => new Date(student.createdAt).toLocaleDateString(),
                        },
                        {
                            key: "isAcitve",
                            label: "Status",
                            render: (student: IUserType) => (
                                <span

                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.isAcitve ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                                        }`}
                                >
                                    {student.isAcitve ? "Active" : "Blocked"}
                                </span>
                            ),
                        },
                    ]}
                    data={students}
                    actions={(student: IUserType) => (
                        <>
                            <button className="text-[#8979FF] hover:text-[#A59BFF] mr-4 transition-colors"
                                onClick={() => handleViewStudent(student)}
                            >View</button>
                            <button
                                onClick={() => {
                                    setblockingStudents(student._id)
                                }}
                                className={`transition-colors ${student.isAcitve ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"
                                    }`}
                            >
                                {student.isAcitve ? "Block" : "Unblock"}
                            </button>
                        </>

                    )}
                />
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
            </div>


            <BaseModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Student Details"
            >
                {selectedStudent && (
                    <div className="text-white">
                        <div className="flex flex-col items-center mb-6">
                            <img
                                src={selectedStudent.profilePicture?.url || '/profilePic.png'}
                                alt={selectedStudent.username}
                                className="h-24 w-24 rounded-full object-cover mb-4"
                            />
                            <h3 className="text-xl font-bold">{selectedStudent.username}</h3>
                            <p className="text-gray-400">{selectedStudent.email}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">Status</p>
                                <div className={`text-base font-medium ${selectedStudent.isAcitve ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {selectedStudent.isAcitve ? 'Active' : 'Blocked'}
                                </div>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">Role</p>
                                <p className="text-base font-medium capitalize">{selectedStudent.role}</p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">Member Since</p>
                                <p className="text-base font-medium">{formatDate(selectedStudent?.createdAt as string)}</p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">User ID</p>
                                <div className='w-full'>
                                    <p className="text-base font-medium break-words">{selectedStudent._id}</p>
                                </div>

                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setIsViewModalOpen(false)
                                    setblockingStudents(selectedStudent._id)
                                }}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedStudent.isAcitve
                                    ? 'bg-red-700 hover:bg-red-600 text-white'
                                    : 'bg-green-700 hover:bg-green-600 text-white'
                                    }`}
                            >
                                {selectedStudent.isAcitve ? 'Block User' : 'Unblock User'}
                            </button>
                        </div>
                    </div>
                )}
            </BaseModal>
            <Confirm isOpen={Boolean(blockingStudent)} onClose={() => setblockingStudents('')}
                onConfirm={() => blockOrUnblock()}
            >
            </Confirm>

        </>
    )
}

export default StudentList