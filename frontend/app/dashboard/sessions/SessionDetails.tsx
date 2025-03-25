
import React from 'react';
import { Clock, Link as LinkIcon, Calendar, BookOpen, Tag, Info, Group, UserCheck2 } from 'lucide-react';
import { ISessionTypes } from '@/types/sessionTypes';
import Link from 'next/link';
import { IGroupType } from '@/types/groupTypes';
import { IUserType } from '@/types/userTypes';
import LinkCopyButton from './LinkCopyButton';

interface SessionDetailsModalProps {
    session: ISessionTypes | null;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ session }) => {
    // Format date and time
    const formattedDate = new Date(session?.date as Date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })


    const formatTime = (time: Date | string) => {
        return new Date(time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleCopy = (link: string) => {
        navigator.clipboard.writeText(link)
    }

    const getStatus = (start: Date | string, end: Date | string) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const currentDate = new Date()

        if (startDate > currentDate) {
            return 'Scheduled'
        }
        if (startDate < currentDate && endDate > currentDate) {
            return 'Live'
        }
        if (endDate < currentDate) {
            return 'Ended'
        }
    }

    return (

        <div

        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#00D2D9]">{session?.sessionName}</h2>
                {
                    getStatus(session?.startTime as Date, session?.endTime as Date) == 'Live' &&
                    <div className="flex items-center space-x-3">
                        <div className="text-[#00D2D9] " >
                            <LinkCopyButton link={session?.sessionLink as string} />
                        </div>

                    </div>
                }
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <BookOpen className="text-[#00D2D9] w-5 h-5" />
                    <span className="font-medium">Subject: {session?.subject}</span>
                </div>

                <div className="flex items-center space-x-3">
                    <Calendar className="text-[#00D2D9] w-5 h-5" />
                    <span className="font-medium">{formattedDate}</span>
                </div>

                <div className="flex items-center space-x-3">
                    <Clock className="text-[#00D2D9] w-5 h-5" />
                    <span className="font-medium">
                        {formatTime(session?.startTime as Date)} - {formatTime(session?.endTime as Date)}
                    </span>
                </div>


                <div className="flex items-center space-x-3">
                    <Tag className="text-[#00D2D9] w-5 h-5" />
                    <span className="font-medium">Session Code: {session?.code}</span>
                </div>

                <div className="flex items-center space-x-3">
                    <Group className="text-[#00D2D9] w-5 h-5" />
                    <span className="font-medium">Group: {(session?.groupId as IGroupType).name}</span>
                </div>

                <div className="flex items-center space-x-3">
                    <UserCheck2 className="text-[#00D2D9] w-5 h-5" />
                    <span className="font-medium">Created By: {(session?.createdBy as IUserType).username}</span>
                </div>

                <div className="flex items-center space-x-3">
                    <Info className="text-[#00D2D9] w-5 h-5" />
                    <span
                        className={`font-medium ${`${getStatus(session?.startTime as Date, session?.endTime as Date)}` === 'Live'
                            ? 'text-green-500'
                            : `${getStatus(session?.startTime as Date, session?.endTime as Date)}` === 'Scheduled'
                                ? 'text-yellow-500'
                                : 'text-red-500'
                            }`}
                    >
                        Status: {getStatus(session?.startTime as Date, session?.endTime as Date)}
                    </span>
                </div>

               

            </div>
        </div>
    );
};

export default SessionDetailsModal;