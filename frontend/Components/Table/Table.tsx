'use client'
import React, { useState } from 'react'

interface Column<T> {
    key: keyof T ;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: (item: T) => React.ReactNode;
}

const Table = <T,>({ columns, data, actions }: TableProps<T>) => {


    return (
        <>
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key as string} className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" scope="col">
                                    {col.label}
                                </th>
                            ))}
                            {actions && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {data?.length > 0 ? (
                            data?.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-750">
                                    {
                                        columns.map((col) => (
                                            <td key={col.key as string} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {col.render ? col.render(item) : (item[col.key] as React.ReactNode)}
                                            </td>
                                        ))
                                    }
                                    {actions && <td className='px-6 py-4 whitespace-nowrap text-righ'>
                                        {actions(item)}
                                    </td>}
                                </tr>
                            ))
                        )
                            : <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-10 text-center text-sm text-gray-400">
                                    No data found.
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table