import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head,Link } from '@inertiajs/react'
import { Button } from '@nextui-org/react'
import React from 'react'

const NoFileView = ({auth}) => {
  return (
    <Authenticated user={auth.user}>
        <Head title='No hay archivo'></Head>
        <TitleTemplate>
            No existe archivo
        </TitleTemplate>
        <ContentTemplate>
            <Link href={route("dashboard")} className='w-full'>
                <Button className='w-full text-large' color='warning' variant='ghost' >Volver inicio</Button>
            </Link>
        </ContentTemplate>
    </Authenticated>
  )
}

export default NoFileView
