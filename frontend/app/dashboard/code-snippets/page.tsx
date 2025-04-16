'use client'
import {useState } from 'react';
import CodeSnippetListing from './CodeListing';


export default function Resources() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false)
    

    return (
        <div className="flex-1 min-h-screen bg-[#1E1E1E] text-white px-6  ml-1">
            <div className="max-w-7xl mx-auto">
                {/* Header with search */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Saved Code Snippets</h1>
                    
                </div>

                {/* Filters row */}
               <CodeSnippetListing/>
                
            </div>
        </div>
    );
}