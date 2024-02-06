import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex w-full items-center px-1 text-sm rounded-md font-medium hover:bg-indigo-300 leading-5 transition duration-250 ease-in-out focus:outline-none' +
                (active
                    ? 'border-indigo-400 bg-indigo-400 rounded-md text-white focus:border-indigo-700 '
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-indigo-300 focus:text-gray-700 focus:border-gray-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
