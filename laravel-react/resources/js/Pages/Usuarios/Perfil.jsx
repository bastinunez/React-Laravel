import React, { useState,useRef } from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import { usePage,useForm } from '@inertiajs/react'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import TextInput from '@/Components/TextInput'
import { Toast } from 'primereact/toast';        
import { usePermission } from '@/Composables/Permission';
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button, Tooltip} from '@nextui-org/react'

const Perfil = ({auth}) => {
    //toast
    const toast_global = useRef(null);
    //mensaje formulario
    const severity = { success:'success',error:'error'}
    const summary = { success:'Exito',error:'Error'}
    const showMsg = (msg,sev,sum) => {
        toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
    }

    const [isDisabled,setIsDisabled] = useState(true);
    const [cambiarPwd,setCambiarPwd] = useState(false);

    //PERMISOS
    const {hasRole,hasPermission} = usePermission()

    const {flash} = usePage().props;

    const { data:dataEdit, setData:setDataEdit, post:postEdit, processing, errors:errorsEdit, reset: resetEdit } = useForm({
        nombres: auth.user.nombres,
        apellidos: auth.user.apellidos,
        correo: auth.user.correo,
        rut: auth.user.rut,
        rol: auth.user.roles,
        permisos: auth.user.permisos,
    });

    const {data:dataPwd, setData:setDataPwd, post:postPwd, processing:processingEdit, errors:errorsPwd, reset: resetPwd} = useForm({
        current_password:'',
        nueva_pwd:'',
    })
    const editarDatos = (e) => {
        e.preventDefault()
        postEdit(route('usuario.edit_data'),{
            onSuccess: ()=>setIsDisabled(!isDisabled),
            onError: () => resetEdit('nombres','apellidos')
        })
        
    }
    const changePwd = (e) => {
        e.preventDefault()
        postPwd(route('usuario.update_pwd'),{
            onSuccess: (msg)=> {showMsg(msg.update,severity.success,summary.success);setCambiarPwd(false)},
            onError: (msg) => {showMsg(msg.update,severity.error,summary.error)},
        })
        
    }


    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Perfil</h2>}>
            <TitleTemplate>
                Mi Perfil
            </TitleTemplate>
            <Toast ref={toast_global}></Toast>
            <ContentTemplate>
                <div>
                    <form onSubmit={editarDatos}>
                        <div className='pt-5'>
                            <div className='w-full xl:flex justify-between mb-4'>
                                <div className='w-full mb-2 lg:mx-8'>
                                    <InputLabel value={"Nombres"}></InputLabel>
                                    <TextInput className="w-full" disabled={isDisabled} type={'text'} value={dataEdit.nombres} onChange={(e) => setDataEdit('nombres',e.target.value)} ></TextInput>
                                    <InputError message={errorsEdit.nombres} className="mt-2" />
                                </div>
                                <div className='w-full mb-2 lg:mx-8'>
                                    <InputLabel value={"Apellidos"}></InputLabel>
                                    <TextInput className="w-full" disabled={isDisabled} type={'text'} value={dataEdit.apellidos} onChange={(e) => setDataEdit('apellidos',e.target.value)} ></TextInput>
                                    <InputError message={errorsEdit.apellidos} className="mt-2" />
                                </div>
                                <div className='w-full mb-2 lg:mx-8'>
                                    <InputLabel value={"Correo"}></InputLabel>
                                    <TextInput className="w-full" disabled={true} type={'text'} value={dataEdit.correo} ></TextInput>
                                </div>
                            </div>
                            <div className='w-full justify-between xl:flex'>
                                <div className='w-full mb-2 lg:mx-8'>
                                    <InputLabel value={"Rut"}></InputLabel>
                                    <TextInput className="w-full" disabled={true} type={'text'} value={dataEdit.rut} ></TextInput>
                                </div>
                                <div className='w-full mb-2 lg:mx-8'>
                                    <InputLabel value={"Rol"}></InputLabel>
                                    <TextInput className="w-full" disabled={true} type={'text'} value={dataEdit.rol}  ></TextInput>
                                </div>
                                {
                                    hasRole('Administrador')?
                                    <>
                                        <div className='w-full mb-2 lg:mx-8'>
                                            <InputLabel value={"Permisos"}></InputLabel>
                                            <Dropdown  type='listbox'> 
                                                <DropdownTrigger>
                                                    <Button variant="bordered">
                                                        Ver Permisos
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu className='h-64 overflow-auto' aria-label="Static Actions" >
                                                    {
                                                        dataEdit.permisos.map((permiso,index) => (
                                                            <DropdownItem key={index}>{permiso}</DropdownItem>
                                                        ))
                                                    }
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </>
                                    :
                                    <></>
                                }
                                
                            </div>
                        </div>
                        <div className='pt-5 xl:flex w-full xl:mx-auto justify-center mt-3 text-large'>
                            {
                                isDisabled?
                                <>
                                    <Button variant='ghost' color='primary' className='w-full xl:mx-8' onClick={(e) => setIsDisabled(!isDisabled)}>Editar mis datos</Button>
                                </>
                                :
                                <>
                                    <Button variant='ghost' color='warning' className='w-full xl:mx-8' onClick={(e) => {resetEdit('nombres','apellidos');setIsDisabled(!isDisabled)}}>Cancelar</Button>
                                    <Button variant='ghost' color='success' disabled={processingEdit} className='w-full xl:mx-8' type='submit'>Guardar cambios</Button>
                                </>
                            }
                        </div>
                        {
                                flash.success_form_edit?
                                <>
                                    <div>Se actualizo la contraseña</div>
                                </>:<></>
                            }
                    </form>
                </div>
                
            </ContentTemplate>
            <ContentTemplate>
                <div className='pt-5 pb-3'>
                    <form onSubmit={changePwd}>
                        {
                            cambiarPwd?
                            <>
                                <div className='md:flex w-full justify-center mb-7'>
                                    <div className='md:mx-10 w-full'>
                                        <InputLabel value={"Antigua contraseña"}></InputLabel>
                                        <TextInput className="w-full" type={'password'} value={dataPwd.current_password} onChange={(e) => setDataPwd('current_password',e.target.value)} ></TextInput>
                                        <InputError message={errorsPwd.current_password} className="mt-2" />
                                    </div>
                                    <div className='md:mx-10 w-full'>
                                        <InputLabel value={"Nueva contraseña"}></InputLabel>
                                        <TextInput className="w-full" type={'password'} value={dataPwd.nueva_pwd} onChange={(e) => setDataPwd('nueva_pwd',e.target.value)} ></TextInput>
                                        <InputError message={errorsPwd.nueva_pwd} className="mt-2" />
                                    </div>
                                </div>
                                <div className='flex w-full gap-1'>
                                    <Tooltip content="Borrarás los cambios" color={"warning"}>
                                        <Button variant='ghost' color='warning' className='w-full md:mx-8' onClick={(e) => {setCambiarPwd(!cambiarPwd)}}>Cancelar</Button>
                                    </Tooltip>
                                    <Button variant='ghost' color='success' className='w-full md:mx-8' type='submit'>Guardar cambios</Button>
                                </div>
                            </>:
                            <>
                                 <div className='flex w-full px-8'>
                                    <Tooltip content="Presiona para ingresar la contraseña actual y luego la nueva" color={"primary"}>
                                        <Button variant='ghost' onClick={() => setCambiarPwd(!cambiarPwd)} color='primary' className='w-full px-8'>Cambiar contraseña</Button>
                                    </Tooltip>
                                    
                                </div>
                            </>
                        }
                    </form>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default Perfil
