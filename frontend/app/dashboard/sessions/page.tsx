import React from 'react'
import SessionsListing from './SessionList'
import { getAllSessions, getMySessions } from '@/services/server/session.server'

async function page() {
    
   
    const sessions = await getMySessions()
    
    return (
        <div className="p-6 bg-[#1E1E1E] text-white w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">My Sessions</h1>
              
            </div>
            <SessionsListing sessions={sessions}/>
        </div>
    )
}

export default page 