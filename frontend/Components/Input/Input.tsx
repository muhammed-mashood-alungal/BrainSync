import React, { ChangeEventHandler } from 'react'

function Input(props: {
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    type: string, name: string,
    placeholder: string
}) {
    return (
        <input
            type={props.type}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-cyan-400"
            required
        />
    )
}

export default Input