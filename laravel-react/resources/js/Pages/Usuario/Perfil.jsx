import React, { useState } from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import TitleTemplate from '@/Components/TitleTemplate'
import ContentTemplate from '@/Components/ContentTemplate'
import { usePage,useForm } from '@inertiajs/react'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import TextInput from '@/Components/TextInput'
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button} from '@nextui-org/react'

const Perfil = ({auth}) => {
    const [isDisabled,setIsDisabled] = useState(true);
    const [cambiarPwd,setCambiarPwd] = useState(false);

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
    console.log(flash)
    const editarDatos = (e) => {
        e.preventDefault()
        postEdit(route('usuario.edit'),{
            onSuccess: setIsDisabled(!isDisabled)
        })
    }
    const changePwd = (e) => {
        e.preventDefault()
        postPwd(route('usuario.update_pwd'),{
            // onSuccess:setCambiarPwd(!cambiarPwd)
        })
        
    }


    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Perfil</h2>}>
            <TitleTemplate>
                Mi Perfil
            </TitleTemplate>
            <ContentTemplate>
                <div>
                    <form onSubmit={editarDatos}>
                        <div className='pt-5'>
                            <div className='w-full flex justify-between mb-4'>
                                <div className='w-full mx-8'>
                                    <InputLabel value={"Nombres"}></InputLabel>
                                    <TextInput className="w-full" disabled={isDisabled} type={'text'} value={dataEdit.nombres} onChange={(e) => setDataEdit('nombres',e.target.value)} ></TextInput>
                                    <InputError message={errorsEdit.nombres} className="mt-2" />
                                </div>
                                <div className='w-full mx-8'>
                                    <InputLabel value={"Apellidos"}></InputLabel>
                                    <TextInput className="w-full" disabled={isDisabled} type={'text'} value={dataEdit.apellidos} onChange={(e) => setDataEdit('apellidos',e.target.value)} ></TextInput>
                                    <InputError message={errorsEdit.apellidos} className="mt-2" />
                                </div>
                                <div className='w-full mx-8'>
                                    <InputLabel value={"Correo"}></InputLabel>
                                    <TextInput className="w-full" disabled={true} type={'text'} value={dataEdit.correo} ></TextInput>
                                </div>
                            </div>
                            <div className='w-full justify-between flex'>
                                <div className='w-full mx-8'>
                                    <InputLabel value={"Rut"}></InputLabel>
                                    <TextInput className="w-full" disabled={true} type={'text'} value={dataEdit.rut} ></TextInput>
                                </div>
                                <div className='w-full mx-8'>
                                    <InputLabel value={"Rol"}></InputLabel>
                                    <TextInput className="w-full" disabled={true} type={'text'} value={dataEdit.rol}  ></TextInput>
                                </div>
                                <div className='w-full mx-8'>
                                    <InputLabel value={"Permisos"}></InputLabel>
                                    <Dropdown aria-label="Static Actions" type='listbox'> 
                                        <DropdownTrigger>
                                            <Button variant="bordered">
                                                Ver Permisos
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu className='h-64 overflow-auto' onScroll={true}>
                                            {
                                                dataEdit.permisos.map((permiso,index) => (
                                                    <DropdownItem key={index}>{permiso}</DropdownItem>
                                                ))
                                            }
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        <div className='pt-5 flex w-full mx-auto justify-center mt-3 text-large'>
                            {
                                isDisabled?
                                <>
                                    <Button variant='ghost' color='primary' className='w-full mx-8' onClick={(e) => setIsDisabled(!isDisabled)}>Editar mis datos</Button>
                                </>
                                :
                                <>
                                    <Button variant='ghost' color='warning' className='w-full mx-8' onClick={(e) => {resetEdit('nombres','apellidos','rut');setIsDisabled(!isDisabled)}}>Cancelar</Button>
                                    <Button variant='ghost' color='success' className='w-full mx-8' type='submit'>Guardar cambios</Button>
                                </>
                            }
                        </div>
                    </form>
                </div>
                
            </ContentTemplate>
            <ContentTemplate>
                <div className='pt-5 pb-3'>
                    <form onSubmit={changePwd}>
                        {
                            cambiarPwd?
                            <>
                                <div className='flex w-full justify-center mb-7'>
                                    <div className='mx-10 w-full'>
                                        <InputLabel value={"Antigua contraseña"}></InputLabel>
                                        <TextInput className="w-full" type={'password'} value={dataPwd.current_password} onChange={(e) => setDataPwd('current_password',e.target.value)} ></TextInput>
                                        <InputError message={errorsPwd.current_password} className="mt-2" />
                                    </div>
                                    <div className='mx-10 w-full'>
                                        <InputLabel value={"Nueva contraseña"}></InputLabel>
                                        <TextInput className="w-full" type={'password'} value={dataPwd.nueva_pwd} onChange={(e) => setDataPwd('nueva_pwd',e.target.value)} ></TextInput>
                                        <InputError message={errorsPwd.nueva_pwd} className="mt-2" />
                                    </div>
                                </div>
                                <div className='flex w-full '>
                                    <Button variant='ghost' color='warning' className='w-full mx-8' onClick={(e) => {setCambiarPwd(!cambiarPwd)}}>Cancelar</Button>
                                    <Button variant='ghost' color='success' className='w-full mx-8' type='submit'>Guardar cambios</Button>
                                </div>
                            </>:
                            <>
                                 <div className='flex w-full px-8'>
                                    <Button variant='ghost' onClick={() => setCambiarPwd(!cambiarPwd)} color='primary' className='w-full px-8'>Cambiar contraseña</Button>
                                </div>
                            </>
                        }{
                            flash.success_form_pwd?
                            <>
                                <div>Se actualizo la contraseña</div>
                            </>:<></>
                        }
                    </form>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default Perfil
