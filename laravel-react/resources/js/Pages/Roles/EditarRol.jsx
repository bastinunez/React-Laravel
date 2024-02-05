import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import { Head ,usePage,useForm,Link} from '@inertiajs/react'
import { usePermission } from '@/Composables/Permission';
import { Button,Dropdown,DropdownItem,DropdownMenu,DropdownTrigger,Table,TableBody,
    TableRow,TableHeader,TableColumn,Pagination,TableCell } from '@nextui-org/react'
import Icon from '@mdi/react';
import { mdiChevronDown,mdiTrashCanOutline} from '@mdi/js';
import { Toast } from 'primereact/toast';       
import React,{useRef,useState,useMemo,useCallback} from 'react'

const EditarRol = ({auth}) => {
    //toast
    const toast_global = useRef(null);
    
    //mensaje formulario
    const severity = { success:'success',error:'error'}
    const summary = { success:'Exito',error:'Error'}
    const showMsg = (msg,sev,sum) => {
        toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
    }

    //PERMISOS
    const {hasRole,hasPermission} = usePermission()

    //VARIABLES QUE ENTREGA EL CONTROLADOR
    const { rol,all_permisos } = usePage().props;
    const permisos_filter = all_permisos.filter(item => !rol.permissions.some(permiso => permiso.name === item.name));


    //formularios
    const { data:data, setData:setData, patch:patch, processing:processing, errors:errors, reset:reset} = useForm({
        nombre: rol.name,
    });
    const { data:dataPermission, setData:setDataPermission, patch:patchPermission, errors:errorsPermission, reset: resetPermission } = useForm({
        permisos:[],
        opcion:''
    });
     //Tabla
    const [seleccion, setSeleccion] = useState([]);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "fecha",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const pages = Math.ceil(rol.permissions.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return rol.permissions.slice(start, end);
    }, [page, rol.permissions, rowsPerPage]);
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);
    const [permissionSelect, setPermissionSelect] = useState("");

    const submit = (e) => {
        e.preventDefault()
        patch(route('rol.update',String(rol.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success)},
            onError: () => {showMsg("Falló",severity.error,summary.error)}
        })
    }
    const submitPermisosAdd = () => {
        if (permissionSelect.size>0){
          let datos=""
          if (permissionSelect=="all"){
              datos = permisos_filter.map(permiso => permiso.id)
          }else{
              const arraySeleccion = Array.from(permissionSelect)
              datos = arraySeleccion.map(permiso => permiso)
          }
          dataPermission.permisos=datos
          patchPermission(route('rol.addPermissions',String(rol.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success)},
            onError: () => {showMsg("Falló",severity.error,summary.error)}
          })
        }else{
          showMsg("No hay seleccion",severity.error,summary.error)
        }
       
    }
    const submitPermisosDelete = (nombre) => {
    dataPermission.permisos = [nombre]
    dataPermission.opcion = 0
    patchPermission(route('rol.deletePermissions',String(rol.id)),{
        onSuccess: () => {showMsg("Exito",severity.success,summary.success)},
        onError: () => {showMsg("Falló",severity.error,summary.error)}
    })
    }
    const submitPermisosDeleteSeleccion = () => {
    if (seleccion.size>0){
        let datos=""
        if (seleccion=="all"){
            datos = permisos_filter.map(permiso => permiso.id)
        }else{
            const arraySeleccion = Array.from(seleccion)
            datos = arraySeleccion.map(permiso => permiso)
        }
        dataPermission.permisos=datos
        dataPermission.opcion = 1
        patchPermission(route('rol.deletePermissions',String(rol.id)),{
        onSuccess: () => {showMsg("Exito",severity.success,summary.success)},
        onError: () => {showMsg("Falló",severity.error,summary.error)}
        })
    }else{
        showMsg("No hay seleccion",severity.error,summary.error)
    }
    
    }

    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar rol</h2>}>
            <Head title='Editar rol'></Head>
            <TitleTemplate>Editar rol</TitleTemplate>
            <Toast ref={toast_global}></Toast>
            <ContentTemplate>
                <div>
                    <div>
                        <form onSubmit={submit} className='p-8'>
                            <div className='xl:flex w-full mb-5 xl: gap-5'>
                                <div className="w-full xl:me-5">
                                    <InputLabel value={"Ingresa nombre"}></InputLabel>
                                    <TextInput type={'text'} className="w-full" placeholder={data.nombre} value={data.nombre} onChange={(e) => setData('nombre',e.target.value)} ></TextInput>
                                    <InputError message={errors.nombre} className="mt-2" />
                                </div>
                            </div>
                            <div className='xl:flex xl:gap-2'>
                                <Link href={route("rol.index")} className='w-full'>
                                    <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                                </Link>
                                <Button className='w-full text-large' color='primary' variant='ghost' type='submit'>Guardar cambios</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </ContentTemplate>
            <ContentTemplate>
                <div>
                <div className='w-full mb-8'>
                            <InputLabel value={"Seleccionar permisos para agregar: "} className='flex items-center me-5'></InputLabel>
                            <div className='w-full flex gap-8'>
                              <div>
                                <Dropdown>
                                  <DropdownTrigger className="hidden sm:flex">
                                    <Button endContent={<Icon path={mdiChevronDown} size={1} />} variant="flat">
                                      Permisos
                                    </Button>
                                  </DropdownTrigger>
                                  <DropdownMenu   aria-label="Table Columns" id='permission' selectedKeys={permissionSelect} style={{maxHeight:"300px"}} className='overflow-hidden whitespace-nowrap overflow-y-scroll'
                                    onSelectionChange={setPermissionSelect} closeOnSelect={false} selectionMode="multiple" items={permisos_filter}>
                                    {
                                      (permiso)=>(
                                        <DropdownItem key={permiso.name}>{permiso.name}</DropdownItem>
                                      )
                                    }
                                  </DropdownMenu>
                                </Dropdown>
                              </div>
                              <div>
                                <Button className='w-full text-large' color='primary' onPress={() => submitPermisosAdd()}
                                variant='ghost' type='submit'>Agregar permisos selecccionados</Button>
                              </div>
                            </div>
                            
                        </div>
                    <div>
                        <div className='w-full'>
                            <div className='flex mb-2'>
                                <div className='w-full justify-end flex'>
                                    <Button className='' color='danger' variant='flat' onPress={()=>submitPermisosDeleteSeleccion()} >Quitar seleccionados</Button>
                                </div>
                            </div>
                            <Table aria-label="Tabla documentos" color={"primary"} selectionMode="multiple"
                            selectedKeys={seleccion} onSelectionChange={setSeleccion}
                            bottomContent={ 
                            <div className="flex w-full justify-center">
                                <Pagination isCompact showControls showShadow color="secondary" page={page}
                                total={pages} onChange={(page) => setPage(page)} />
                            </div>
                            }>
                                <TableHeader>
                                    <TableColumn className='text-start text-tiny lg:text-small'>Permiso</TableColumn>
                                    <TableColumn className='text-start text-tiny lg:text-small'>Acción</TableColumn>
                                </TableHeader>
                                <TableBody className=''>
                                    {
                                    sortedItems.map((permiso,index)=>(
                                        <TableRow key={permiso.name}>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis text-tiny lg:text-small'>{permiso.name}</TableCell>
                                        <TableCell className='overflow-hidden whitespace-nowrap text-ellipsis text-tiny lg:text-small'>
                                            {
                                            <Button color='danger' endContent={<Icon size={1} path={mdiTrashCanOutline} />} 
                                            onPress={() => submitPermisosDelete(permiso)} size='sm'></Button>
                                            }
                                        </TableCell>
                                        </TableRow>
                                    ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default EditarRol
