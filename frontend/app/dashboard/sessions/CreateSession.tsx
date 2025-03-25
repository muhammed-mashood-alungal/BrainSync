'use client'
import Input from '@/Components/Input/Input';
import BaseModal from '@/Components/Modal/Modal'
import { useAuth } from '@/Context/auth.context';
import { GroupServices } from '@/services/client/group.client';
import { SessionServices } from '@/services/client/session.client';
import { IGroupType } from '@/types/groupTypes';
import { validateSessionForm } from '@/validations';
import { ChevronDown } from 'lucide-react';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react'

function CreateSession({ onClose }: { onClose: () => void }) {
  const [myGroups, setMyGroups] = useState<IGroupType[]>([])
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    sessionName: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    groupId: ''
  });
  const [err, setErr] = useState({
    sessionName: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    groupId: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErr(() => {
      return {
        sessionName: '',
        subject: '',
        date: '',
        startTime: '',
        endTime: '',
        groupId: ''
      }
    })
    const result = validateSessionForm(formData)
    console.log(result)
    if (result.status) {
      console.log(formData)
      await SessionServices.createSession(formData)
      onClose()
    } else {
      setErr(prev => {
        return {
          sessionName: result.errors.sessionName as string,
          subject: result.errors.subject as string,
          date: result.errors.date as string,
          startTime: result.errors.startTime as string,
          endTime: result.errors.endTime as string,
          groupId: result.errors.groupId as string
        }
      })
    }
  }

  const fetchMyGroups = async () => {
    const groups = await GroupServices.getMyGroups(user?.id as string)
    setMyGroups(groups)
  }
  return (
    <>

      <BaseModal title='Create New Group' isOpen={true} onClose={onClose}>
        <div className="px-8 py-6 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Create Session</h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Session Name */} 
              <div>
                <Input
                  type="text"
                  name="sessionName"
                  placeholder="Session Name"
                  value={formData.sessionName}
                  onChange={handleChange}
                />
                <span className='text-red-600 ml-1'  > {err?.sessionName}</span>
              </div>

              {/* Subject */}
              <div>
                <Input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                <span className='text-red-600 ml-1'  > {err?.subject}</span>
              </div>

              <div>
                <Input
                  type="text"
                  name="date"
                  placeholder="Date"
                  value={formData.date}
                  onChange={handleChange}
                  onFocus={(e) => e.target.type = 'date'}
                />
                <span className='text-red-600 ml-1'  > {err?.date}</span>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="time"
                    name="startTime"
                    placeholder="Starting Time"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                  <span className='text-red-600 ml-1'  > {err?.startTime}</span>
                </div>
                <div className="flex-1">
                  <Input
                    type="time"
                    name="endTime"
                    placeholder="End Time"
                    value={formData.endTime}
                    onChange={handleChange}
                  //onFocus={(e) => e.target.type = 'time'}
                  //onBlur={(e) => e.target.type = 'text'}
                  />
                  <span className='text-red-600 ml-1'  > {err?.endTime}</span>
                </div>
              </div>



              {/* Group Selector */}
              <div className="relative">
                <select
                  name="groupId"
                  onClick={(e) => fetchMyGroups()}
                  value={formData.groupId}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-md border-gray-700 border   text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                >
                  <option value="" disabled>Select Your Group</option>
                  {myGroups?.map((group) => (
                    <option key={group._id} value={group._id} className='text-black '>
                      {group.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={20} className="text-white" />
                </div>
                <span className='text-red-600 ml-1'  > {err?.groupId}</span>
              </div>

              {/* Actions */}
              <div className="pt-6 flex flex-col items-center">
                <button
                  type="submit"
                  className="w-full max-w-xs py-3 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150"
                  style={{ backgroundColor: '#00D2D9' }}
                >
                  Create Session
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 text-cyan-400 hover:text-cyan-300 focus:outline-none"
                  style={{ color: '#00D2D9' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </BaseModal>
    </>
  )
}

export default CreateSession