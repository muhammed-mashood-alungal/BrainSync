'use client'

import { reportService } from "@/services/client/report.client";
import { IReportTypes } from "@/types/report.types";
import { useEffect, useState } from "react";
import { format } from 'date-fns'
import Table from "@/Components/Table/Table";





function ReportsListing() {
    const [reports, setReports] = useState<IReportTypes[]>([])
   const limit = 8
    const [totalCount , setTotalCount] = useState(0)
    useEffect(() => {
        fetchReports(1 , limit)
    }, [])

    async function fetchReports(currentPage : number, limit : number) {
        const {reports , count} = await reportService.getAllReports('All' , (currentPage - 1)*limit , limit)
        setTotalCount(count)
      //  setTotalPage( Math.ceil(count / limit))
        setReports(reports)
    }


    const handleResolve = async (report: IReportTypes) => {
        await reportService.resolve(report._id)
        setReports((prev) => {
            return prev.map((repo) => {
                return repo._id == report._id ? { ...repo, status: 'Resolved' } : repo
            })
        })
    }
    const handleCloseReport = async (report: IReportTypes) => {
        await reportService.closeReport(report._id)
        setReports((prev) => {
            return prev.map((repo) => {
                return repo._id == report._id ? { ...repo, status: 'Closed' } : repo
            })
        })
    }

    const columns = [
        {
            key: 'name' as keyof IReportTypes,
            label: 'Session',
            render: (report: IReportTypes) => (
                <div className="flex items-center gap-2">
                    <div className="text-teal-500">
                    </div>
                    <span>{report.sessionId.sessionName} </span>
                </div>
            )
        },
        {
            key: 'createdAt' as keyof IReportTypes,
            label: 'Reported At',
            render: (report: IReportTypes) => {
                const date = new Date(report.createdAt as Date)
                return format(new Date(date), "MMM d 'at' h:mma")
            }
        },
        {
            key: 'reportedBy' as keyof IReportTypes,
            label: 'Reported By',
            render: (report: IReportTypes) => report.reportedBy.username
        },
        {
            key: 'reason' as keyof IReportTypes,
            label: 'Reason',
            render: (report: IReportTypes) => report.reason
        },
        {
            key: 'status' as keyof IReportTypes,
            label: 'Status',
            render: (report: IReportTypes) => report.status
        }
    ];

    // Actions for each row (optional)
    const actions = (report: IReportTypes) => (
        <div className="flex space-x-2">
            <button className={`${report.status == 'Pending' ? "text-red-500 hover:text-red-700" : 'text-gray-700'} `}
                onClick={() => handleResolve(report)} disabled={report.status != 'Pending'} >
                Solve
            </button>
            <button className={`${report.status == 'Pending' ? "text-red-500 hover:text-red-700" : 'text-gray-700'} `} onClick={() => handleCloseReport(report)} disabled={report.status != 'Pending'} >
                Close
            </button>
        </div>
    );

    return (
        <>
            <Table data={reports} columns={columns} actions={actions} totalCount={totalCount} 
            onPageChange={(page : number  , limit : number)=>fetchReports(page , limit)} ShowSearchBar={false}
            />
        </>
    )
}

export default ReportsListing