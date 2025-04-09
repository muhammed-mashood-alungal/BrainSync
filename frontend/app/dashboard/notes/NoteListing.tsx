import Table from '@/Components/Table/Table'
import { INoteTypes } from '@/types/note.types'
import React from 'react'
import {format } from 'date-fns'
import { noteServices } from '@/services/client/note.client'
function NoteListing({notes} : {notes : INoteTypes[]}) {

    const downloadPdf=(pdfFileId : string)=>{
       noteServices.getNotePdf(pdfFileId)
    }

    const columns = [
        {
          key: 'name' as keyof INoteTypes,
          label: 'Name',
          render: (note: INoteTypes) => (
            <div className="flex items-center gap-2">
              <div className="text-teal-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-5 h-5">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
              </div>
              <span>{note.sessionId.sessionName} - Note</span>
            </div>
          )
        },
        {
          key: 'updatedAt' as keyof INoteTypes,
          label: 'Date Edited',
          render: (note: INoteTypes) => {
            const date = new Date(note.updatedAt as Date)
            return format(new Date(date), "MMM d 'at' h:mma")
          }
        },
        {
          key: 'sessionId' as keyof INoteTypes,
          label: 'Session',
          render: (note: INoteTypes) => note.sessionId.sessionName
        },
        {
          key: 'userId' as keyof INoteTypes,
          label: 'Subject',
          render: (note: INoteTypes) => note.sessionId.subject 
        }
      ];
    
      // Actions for each row (optional)
      const actions = (note: INoteTypes) => (
        <div className="flex space-x-2">
          <button className="text-blue-500 hover:text-blue-700" onClick={()=>downloadPdf(note.pdfFileId)}>
           Download
          </button>
          <button className="text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      );


  return (
    <Table data={notes} columns={columns} actions={actions} />
  )
}

export default NoteListing