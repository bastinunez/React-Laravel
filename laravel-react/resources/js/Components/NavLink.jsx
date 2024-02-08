import { Link } from '@inertiajs/react';
import { Tooltip } from '@nextui-org/react';
import { useSidebarStore,useActiveLinkStore } from '@/Store/useStore';

export default function NavLink({ active = false, className = '',tooltip='', children, ...props }) {
    const { sidebar,changeState} = useSidebarStore();
    return (
        <Tooltip content={tooltip} isDisabled={sidebar}>
        <Link
            {...props}
            className={
                'inline-flex w-full items-center px-1 text-sm rounded-md font-medium hover:bg-white leading-5 transition duration-250 ease-in-out focus:outline-none' +
                (active
                    ? 'border-indigo-400 bg-white rounded-md text-indigo-900 focus:border-indigo-700 '
                    : 'border-transparent text-white hover:text-gray-700 hover:border-indigo-300 focus:text-indigo-900 focus:border-gray-300 ') +
                className
            }
        >
            {children}
        </Link>

    </Tooltip>
    );
}
