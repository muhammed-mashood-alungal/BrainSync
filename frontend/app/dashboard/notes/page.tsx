'use client'
import NoteListing from './NoteListing';


export default function Resources() {

    return (
        <div className="flex-1 min-h-screen bg-[#1E1E1E] text-white px-6  ml-1">
            <div className="max-w-7xl mx-auto">
                {/* Header with search */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Notes</h1>
                </div>

                {/* Filters row */}
               
                <NoteListing />
            </div>
        </div>
    );
} 