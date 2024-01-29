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
    Input,Dropdown,DropdownItem,DropdownTrigger,DropdownMenu, Chip,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip,}  from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileEyeOutline, mdiFileDownloadOutline, 
    mdiPencilBoxOutline,mdiMagnify,mdiChevronDown,mdiPlus, mdiCancel, mdiCheckUnderline} from '@mdi/js';


const ShowFuncionarios = ({auth}) => {
    //PERMISOS
    const {hasRoles,hasPermission} = usePermission()

    //VARIABLES QUE ENTREGA EL CONTROLADOR
    const { all_funcionarios } = usePage().props;
    const [funcionarios,setFuncionarios] = useState(all_funcionarios)
    const getDocumentos = async () => {
        try {
        const response = await axios.get(`/api/all-documents`); // Cambia la ruta según tu configuración
        //console.log('Documentos obtenidos:', response.data);
        setFuncionarios(response.data.documentos)
        // Aquí puedes actualizar tu estado o realizar otras acciones con los documentos obtenidos
        } catch (error) {
        console.error('Error al obtener documentos:', error);
        }
    }

    const columnas = [
        {name: "ID", uid: "id", sortable: true},
        {name: "Nombres", uid: "nombres", sortable: true},
        {name: "Apellidos", uid: "apellidos", sortable: true},
        {name: "Abreviacion", uid: "abreviacion", sortable: true},
        {name: "Acciones", uid: "accion"},
    ];
    
    const [filterNombre,setFilterNombre] = useState('');
    const [seleccion, setSeleccion] = useState([]);
    const hasSearchFilterNombre = Boolean(filterNombre);
    const filteredItems = useMemo(() => {
        let filteredFuncionarios = [...funcionarios];
        if (hasSearchFilterNombre) {
            filteredFuncionarios = filteredFuncionarios.filter((funcionario) => funcionario.nombres.toLowerCase().includes(filterNombre.toLowerCase()));
        }
        return filteredFuncionarios;
    }, [funcionarios,filterNombre]);

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
        <Authenticated  user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Funcionarios</h2>}>
            <Head title='Funcionarios' />
            <TitleTemplate>Funcionarios</TitleTemplate>
            <FilterTemplate>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center gap-4 items-end">
                        <Input isClearable classNames={{input:["border-none"]}} type='text'
                        className="w-full input-next border-none" size='sm' placeholder="Buscar por nombre..."
                        startContent={<Icon path={mdiMagnify} size={1} />} value={filterNombre}
                        onClear={() => onClearNombre()} onValueChange={onSearchChangeNombre} />
                        <div className="flex w-full">
                            <div className='w-full flex items-center'>
                                <span className="text-default-400 text-small">Total {funcionarios.length} funcionarios</span>
                            </div>
                            <div className='w-full'>
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
                            hasPermission('Gestion-Crear funcionario')?
                            <>
                            <Link href={route('funcionario.create')}>
                                <Button color="success" variant="solid" endContent={<Icon path={mdiPlus} size={1} />}>
                                Agregar funcionario
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
                        <TableBody emptyContent={"No existen funcionarios"}>
                            {
                                sortedItems.map((funcionario)=>(
                                    <TableRow key={funcionario.id} className='text-start'>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{funcionario.id}</TableCell>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{funcionario.nombres}</TableCell>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{funcionario.apellidos}</TableCell>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>{funcionario.abreviacion}</TableCell>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis'>
                                            {
                                                hasPermission('Gestion-Editar funcionario')?
                                                <>
                                                  <Tooltip content={"Editar"} color='warning'>
                                                    <Link href={route('funcionario.edit',String(funcionario.id))} >
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

export default ShowFuncionarios