import React,{useState,useMemo, useCallback} from 'react'
import { Head } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import TitleTemplate from '@/Components/TitleTemplate';
import ContentTemplate from '@/Components/ContentTemplate';
import FilterTemplate from '@/Components/FilterTemplate';

import { usePage ,Link, useForm} from '@inertiajs/react';
import { usePermission } from '@/Composables/Permission';
import Select from '@/Components/Select';
import {Button, Pagination, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
    Input, Tooltip,}  from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiPencilBoxOutline,mdiMagnify,mdiVacuumOutline,mdiPlus} from '@mdi/js';

const Gestion = ({auth}) => {
    //PERMISOS
    const {hasRoles,hasPermission} = usePermission()

    //VARIABLES QUE ENTREGA EL CONTROLADOR
    const { all_permisos } = usePage().props;
    const [permisos,setPermisos] = useState(all_permisos)

    const columnas = [
        {name: "ID", uid: "id", sortable: true},
        {name: "Nombre", uid: "nombre", sortable: true},
        {name: "Acciones", uid: "accion"},
    ];
    
    const [filterNombre,setFilterNombre] = useState('');
    const [seleccion, setSeleccion] = useState([]);
    const hasSearchFilterNombre = Boolean(filterNombre);
    const filteredItems = useMemo(() => {
        let filteredPermiso = [...permisos];
        if (hasSearchFilterNombre) {
            filteredPermiso = filteredPermiso.filter((rol) => rol.name.toLowerCase().includes(filterNombre.toLowerCase()));
        }
        return filteredPermiso;
    }, [permisos,filterNombre]);

    const onSearchChangeNombre = useCallback((value) => {
        if (value) {
            setFilterNombre(value);
            setPage(1);
        } else {
            setFilterNombre("");
        }
    }, []);
    const onClearNombre = useCallback(()=>{
        setFilterNombre("")
        setPage(1)
    },[])
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "fecha",
        direction: "ascending",
      });

    //Tabla
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);


    return (
        <Authenticated user={auth.user}>
            <Head title='Permisos' />
            <TitleTemplate>Permisos</TitleTemplate>
            <FilterTemplate>
                <div className="flex flex-col gap-4">
                    <div className="md:flex justify-center gap-4 items-end">
                        <Input isClearable classNames={{input:["border-none"]}} type='text'
                        className="w-full input-next border-none" size='sm' placeholder="Buscar por nombre..."
                        startContent={<Icon path={mdiMagnify} size={1} />} value={filterNombre}
                        onClear={() => onClearNombre()} onValueChange={onSearchChangeNombre} />
                        <div className="flex w-full mt-2 gap-1 md:gap-2">
                            <div className='flex items-center'>
                                <span className="text-default-400 text-small">Total {permisos.length} permisos</span>
                            </div>
                            <Button color='warning'  onPress={()=>limpiarFiltros()}>
                                <Icon path={mdiVacuumOutline} size={1} />
                                <p className='hidden lg:flex'>
                                Limpiar filtros
                                </p>
                            </Button>
                            <div className=''>
                                <label className="flex items-center text-default-400 text-small">
                                    Filas por pagina:
                                    <Select onChange={(value) => {setRowsPerPage(value);setPage(1)}} value={rowsPerPage} opciones={[{id:5,nombre:5},{id:8,nombre:8},{id:12,nombre:12}]}>
                                    </Select>
                                </label>
                            </div>
                           
                        </div>
                    </div>
                    
                </div>
            </FilterTemplate>
            <ContentTemplate>
                <div className='flex justify-between mb-3'>
                    <div>
                        <h1 className='text-2xl'>Resultados</h1>
                    </div>
                    <div className='flex gap-3'>
                        {
                            hasPermission('Gestion-Crear rol')?
                            <>
                            <Link href={route('permiso.create')}>
                                <Button color="success" variant="solid" endContent={<Icon path={mdiPlus} size={1} />}>
                                Agregar rol
                                </Button>
                            </Link>
                            </>:<></>
                        }
                    </div>
                </div>
                <div className='w-full'>
                    <Table aria-label="Tabla documentos" color={"primary"} selectionMode="multiple"  
                    selectedKeys={seleccion} onSelectionChange={setSeleccion}  
                    bottomContent={ 
                    <div className="flex w-full justify-center">
                        <Pagination isCompact showControls showShadow color="secondary" page={page}
                        total={pages} onChange={(page) => setPage(page)} />
                    </div>
                    }
                    classNames={{  wrapper: "min-h-[222px]", }}>
                        <TableHeader>
                            {columnas.map((columna)=>(
                                <TableColumn className='text-start text-small' key={columna.uid}>{columna.name}</TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody emptyContent={"No existen permisos"}>
                            {
                                sortedItems.map((permiso)=>(
                                    <TableRow key={permiso.id} className='text-start'>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{permiso.id}</TableCell>
                                        <TableCell className='overflow-auto whitespace-nowrap text-ellipsis'>{permiso.name}</TableCell>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>
                                            {
                                                hasPermission('Gestion-Editar permiso')?
                                                <>
                                                  <Tooltip content={"Editar"} color='warning'>
                                                    <Link href={route('permiso.edit',String(permiso.id))} >
                                                      <Button className="me-1" size='sm' color='warning' variant='flat'> 
                                                        {/* active={route().current('documento.visualizar')} */}
                                                      <Icon path={mdiPencilBoxOutline} size={1}/>
                                                        
                                                      </Button>
                                                    </Link>
                                                  </Tooltip>
                                                </>:
                                                <></>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default Gestion
