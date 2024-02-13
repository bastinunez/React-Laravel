import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import { Head ,usePage,useForm,Link} from '@inertiajs/react'
import { usePermission } from '@/Composables/Permission';
import { Button,Chip,Table,TableBody,Modal,ModalBody,ModalContent,ModalHeader,ModalFooter,
    TableRow,TableHeader,TableColumn,Pagination,TableCell, useDisclosure, Progress, Select, SelectItem} from '@nextui-org/react'
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

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [modalPlacement, setModalPlacement] = useState("auto");
    const [titleModal,setTitleModal] = useState('')
    const [contentModal,setContentModal] = useState('')
    const [functionName,setFunctionName] = useState('')
    const [stateBtnModal,setStateBtnModal] = useState(false)

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
    const [permissionSelect, setPermissionSelect] = useState([]);

    const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();

    const submit = (e) => {
        e.preventDefault()
        onOpenProgress()
        patch(route('rol.update',String(rol.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success);onCloseProgress()},
            onError: () => {showMsg("Falló",severity.error,summary.error);onCloseProgress()}
        })
    }
    const submitPermisosAdd = (e) => {
        if (permissionSelect.size>0){
          let datos=""
          onOpenProgress()
          setStateBtnModal(true)
          if (permissionSelect=="all"){
              datos = permisos_filter.map(permiso => permiso.id)
          }else{
              const arraySeleccion = Array.from(permissionSelect)
              datos = arraySeleccion.map(permiso => permiso)
          }
          dataPermission.permisos=datos
          patchPermission(route('rol.addPermissions',String(rol.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success);onCloseProgress();setPermissionSelect([]);setStateBtnModal(false)},
            onError: () => {showMsg("Falló",severity.error,summary.error);onCloseProgress();setStateBtnModal(false)}
          })
        }else{
          showMsg("No hay seleccion",severity.error,summary.error)
        }
       
    }
    const submitPermisosDelete = (nombre) => {
        dataPermission.permisos = [nombre]
        dataPermission.opcion = 0
        onOpenProgress()
        setStateBtnModal(true)
        patchPermission(route('rol.deletePermissions',String(rol.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success);onCloseProgress();setStateBtnModal(false)},
            onError: () => {showMsg("Falló",severity.error,summary.error);onCloseProgress();setStateBtnModal(false)}
        })
    }
    const submitPermisosDeleteSeleccion = (e) => {
        if (seleccion.size>0){
            let datos=""
            onOpenProgress()
            setStateBtnModal(true)
            if (seleccion=="all"){
                datos = permisos_filter.map(permiso => permiso.id)
            }else{
                const arraySeleccion = Array.from(seleccion)
                datos = arraySeleccion.map(permiso => permiso)
            }
            dataPermission.permisos=datos
            dataPermission.opcion = 1
            patchPermission(route('rol.deletePermissions',String(rol.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success);onCloseProgress();setSeleccion([]);setStateBtnModal(false)},
            onError: () => {showMsg("Falló",severity.error,summary.error);onCloseProgress();setStateBtnModal(false)}
            })
        }else{
            showMsg("No hay seleccion",severity.error,summary.error)
        }
    }
    const handleSelectionChange = (e) => {
        setPermissionSelect(new Set(e.target.value.split(",")));
    };

    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar rol</h2>}>
            <Head title='Editar rol'></Head>
            <TitleTemplate>Editar rol</TitleTemplate>
            <Toast ref={toast_global}></Toast>
            <Modal isOpen={isOpenProgress} onClose={onCloseProgress}>
                <ModalContent>
                    {
                        (onCloseProgress)=>(
                            <Progress
                                size="sm"
                                isIndeterminate
                                aria-label="Loading..."
                                className="max-w-md"
                            />
                        )
                    }
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">{titleModal}</ModalHeader>
                        <ModalBody>
                            {
                                <p>{contentModal}</p>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" disabled={stateBtnModal} onPress={onClose} onClick={()=>functionName()}>
                                Confirmar
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                    </ModalContent>
                </Modal>
            <ContentTemplate>
                <div>
                <div className='w-full mb-8'>
                            <InputLabel value={"Seleccionar permisos para agregar: "} className='flex items-center me-5'></InputLabel>
                            <div className='w-full lg:flex gap-8'>
                            {
                                permisos_filter.length!=0?
                                <>
                                  <div className='w-full'>
                                        <Select label="Permisos: " selectionMode="multiple" placeholder="Seleccionar permisos..."
                                            selectedKeys={permissionSelect} className="max-w-xs md:max-w-md xl:max-w-5xl" onChange={handleSelectionChange}>
                                            {
                                                permisos_filter.map((permiso)=>(
                                                    <SelectItem key={permiso.name} textValue={permiso.name}>
                                                        <div className="flex flex-col">
                                                            <span className="text-small">{"Permiso: " +permiso.name}</span>
                                                            {/* <span className="text-tiny">
                                                                {"Autor: "+ doc.autor +" | Tipo: "+doc.tipo+" | Dirección: "+ doc.direccion + " | Fecha: "+doc.fecha}
                                                            </span> */}
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            }
                                            
                                        </Select>
                                    </div>
                                    <div className='flex items-center'>
                                        <Button className='w-full text-large' color='primary' onPress={()=>{
                                                    setFunctionName(() => () => submitPermisosAdd());setTitleModal('Guardar cambios');
                                                    setContentModal('¿Está seguro de aplicar los cambios?');onOpen();}}  
                                        //onPress={() => submitPermisosAdd()}
                                        variant='ghost' type='submit'>Agregar permisos selecccionados</Button>
                                    </div>
                                </>:
                                <>
                                  <Chip>Ya tienes todos los permisos</Chip>
                                </>
                              }
                              
                            </div>
                        </div>
                    <div>
                        <div className='w-full'>
                            <div className='flex mb-2'>
                                <div className='w-full justify-end flex'>
                                    <Button className='' color='danger' variant='flat' onPress={()=>{
                                                    setFunctionName(() => () => submitPermisosDeleteSeleccion());setTitleModal('Guardar cambios');
                                                    setContentModal('¿Está seguro de aplicar los cambios?');onOpen();}}  
                                    >Quitar seleccionados</Button>
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
                                            onPress={()=>{
                                                setFunctionName(() => () => submitPermisosDelete(permiso));setTitleModal('Guardar cambios');
                                                setContentModal('¿Está seguro de aplicar los cambios?');onOpen();}}  
                                                size='sm'></Button>
                                            }
                                        </TableCell>
                                        </TableRow>
                                    ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            <Link href={route('rol.index')} className='w-full'>
                                <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default EditarRol
