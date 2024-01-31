import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React, { useState, useEffect, useRef, useMemo} from 'react'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import Select from '@/Components/Select'
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';        
import { usePage ,Link,useForm} from '@inertiajs/react';
import { usePermission } from '@/Composables/Permission';
import { Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,Select as NextSelect, SelectItem as NextSelectItem,
    Table, TableBody, TableColumn, TableHeader, TableCell,TableRow,Pagination, Divider} from '@nextui-org/react';
import Icon from '@mdi/react';
import { mdiDownloadOutline, mdiTrashCanOutline } from '@mdi/js';


const AgregarUsuario = ({auth}) => {
    //toast
    const toast_global = useRef(null);

    //PERMISOS
    const {hasRoles,hasPermission} = usePermission()

    //VARIABLES QUE ENTREGA EL CONTROLADOR
    const { roles } = usePage().props;

    const [btnAgregarManual,setbtnAgregarManual] = useState(true)
    const [btnAgregarXlsx,setBtnAgregarXlsx] = useState(false)

    //formularios
    const { data:data, setData:setData, post:post, processing:processing, errors:errors, reset:reset} = useForm({
        nombres:'',
        apellidos:'',
        rut:'',
        rol:'',
    });

    //mensaje formulario
    const severity = { success:'success',error:'error'}
    const summary = { success:'Exito',error:'Error'}
    const showMsg = (msg,sev,sum) => {
        toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
    }

    const submit = (e) => {
        e.preventDefault()
        post(route('gestion-usuarios.store'),{
            onSuccess: (msg) => {showMsg(msg.create,severity.success,summary.success)},
            onError: (msg) => {showMsg(msg.create,severity.error,summary.error)},
        })
    }
    


    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar usuario</h2>}>
            <Head title="Agregar Usuario"></Head>
            <TitleTemplate>Agregar usuario</TitleTemplate>
            <Toast ref={toast_global}></Toast>
            <ContentTemplate>
                <div className='p-8'>
                    {/* Seleccionar accion */}
                    <div className='flex w-full gap-4'>
                        {
                            hasPermission('Crear usuario')?
                            <>
                                <div className='w-full'>
                                    <Button color='secondary' className='w-full text-medium' variant={btnAgregarManual?'solid':'ghost'} 
                                    onClick={() => { if(!btnAgregarManual){setBtnAgregarXlsx(!btnAgregarXlsx);setbtnAgregarManual(!btnAgregarManual)}}} >
                                        Agregar usuario manualmente
                                    </Button>
                                </div>
                            </>
                            :
                            <></>
                        }
                        {
                            hasPermission('Cargar usuarios xlsx')?
                            <>
                                <div className='w-full'>
                                    <Button color='secondary' className='w-full text-medium'  variant={btnAgregarXlsx?'solid':'ghost'} 
                                    onClick={() => {
                                        if (!btnAgregarXlsx){
                                            setBtnAgregarXlsx(!btnAgregarXlsx);setbtnAgregarManual(!btnAgregarManual)
                                        }
                                        }} >
                                        Cargar vía XLSX
                                    </Button>
                                </div>
                            </>
                            :
                            <></>
                        }
                       
                    </div>
                    <Divider className='mt-10 w-full'></Divider>
                    <div className='mt-10 w-full'>
                        {
                            btnAgregarManual?
                            //se muestra formulario de agregar usuario
                            <>
                                <form onSubmit={submit}>
                                    <div className='w-full justify-between flex mb-7 gap-10'>
                                        <div className="w-full">
                                            <InputLabel value={"Ingresa nombres"}></InputLabel>
                                            <TextInput type={'text'} className="w-full" value={data.nombres} onChange={(e) => setData('nombres',e.target.value)} required></TextInput>
                                            <InputError message={errors.nombres} className="mt-2" />
                                        </div>
                                        <div className="w-full">
                                            <InputLabel value={"Ingresa apellidos"}></InputLabel>
                                            <TextInput type={'text'} className="w-full" value={data.apellidos} onChange={(e) => setData('apellidos',e.target.value)} required ></TextInput>
                                            <InputError message={errors.apellidos} className="mt-2" />
                                        </div>
                                        <div className="w-full">
                                            <InputLabel value={"Ingresa rut"}></InputLabel>
                                            <TextInput type={'text'} className="w-full" value={data.rut} onChange={(e) => setData('rut',e.target.value)} required ></TextInput>
                                            <InputError message={errors.rut} className="mt-2" />
                                        </div>
                                        <div className='w-full'>
                                            <InputLabel value={"Selecciona rol"}></InputLabel>
                                            <Select opciones={roles} value={data.rol} onChange={(value) => setData('rol', value)} required>
                                            </Select>
                                            <InputError message={errors.rol} className="mt-2" />
                                        </div>
                                    </div>
                                    <div className='flex w-full gap-10'>
                                        <Link href={route("gestion-usuarios.index")} className='w-full'>
                                            <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                                        </Link>
                                        <Button className='w-full text-large' color='primary' variant='ghost' type='submit'>Registrar</Button>
                                    </div>
                                </form>
                            </>
                            :
                            //se muestra plantilla para cargar masivamente usuarios
                            <>

                            </>
                        }
                    </div>
                </div>
            </ContentTemplate>
        </Authenticated>
  )
}

export default AgregarUsuario
