import ContentTemplate from '@/Components/ContentTemplate'
import FilterTemplate from '@/Components/FilterTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'

const ShowUsers = () => {
  return (
    <Authenticated user={auth.user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion de usuarios</h2>}>
        <TitleTemplate>Gestion de usuarios</TitleTemplate>
        <FilterTemplate>
            Aqui van los filtros
        </FilterTemplate>
        <ContentTemplate>
            Aqui se muestran los usuarios
        </ContentTemplate>
    </Authenticated>
  )
}

export default ShowUsers
