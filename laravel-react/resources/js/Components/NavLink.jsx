import { Link } from '@inertiajs/react';
import { Tooltip } from '@nextui-org/react';

export default function NavLink({ active = false, className = '',tooltip='', children, ...props }) {
    return (
        <Tooltip content={tooltip}>
        <Link
            {...props}
            className={
                'inline-flex w-full items-center px-1 text-sm rounded-md font-medium hover:bg-white leading-5 transition duration-250 ease-in-out focus:outline-none' +
                (active
                    ? 'border-indigo-400 bg-indigo-400 rounded-md text-white focus:border-indigo-700 '
                    : 'border-transparent text-white hover:text-gray-700 hover:border-indigo-300 focus:text-gray-700 focus:border-gray-300 ') +
                className
            }
        >
            {children}
        </Link>

    </Tooltip>
    );
}
