import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head,Link } from '@inertiajs/react'
import { Button } from '@nextui-org/react'
import React from 'react'

const NoDireccionEdit = ({auth}) => {
  return (
    <Authenticated user={auth.user}>
        <Head title='No hay direccion'></Head>
        <TitleTemplate>
            No existe la direccion
        </TitleTemplate>
        <ContentTemplate>
            <Link href={route("direccion.index")} className='w-full'>
                <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
            </Link>
        </ContentTemplate>
    </Authenticated>
  )
}

export default NoDireccionEdit
