import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head,Link } from '@inertiajs/react'
import { Button } from '@nextui-org/react'
import React from 'react'

const NoFuncionarioEdit = ({auth}) => {
  return (
    <Authenticated user={auth.user}>
        <Head title='No hay funcionario'></Head>
        <TitleTemplate>
            No existe el funcionario
        </TitleTemplate>
        <ContentTemplate>
            <Link href={route("funcionario.index")} className='w-full'>
                <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
            </Link>
        </ContentTemplate>
    </Authenticated>
  )
}

export default NoFuncionarioEdit
