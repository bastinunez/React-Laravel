import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import { Head, useForm, Link} from '@inertiajs/react'
import { Button } from '@nextui-org/react'
import { Toast } from 'primereact/toast';        
import React,{useRef} from 'react'

const AgregarFuncionario = ({auth}) => {
    //toast
    const toast_global = useRef(null);
    
    //mensaje formulario
    const severity = { success:'success',error:'error'}
    const summary = { success:'Exito',error:'Error'}
    const showMsg = (msg,sev,sum) => {
        toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
    }


    //QUEDE AQUI FALTA REALIZAR EL POST, MODIFICAR LOS MENSAJES CON TOAST (ES MEJOR DEJARLO GLOBAL EN EL AUTHENTICAD LAYOUT )


    //formularios
    const { data:data, setData:setData, post:post, processing:processing, errors:errors, reset:reset} = useForm({
        nombres: '',
        apellidos: '',
    });

    const submit = (e) => {
        e.preventDefault()
        post(route('funcionario.store'),{
            onSuccess: (msg) => {showMsg(msg.create,severity.success,summary.success);reset()},
            onError: (msg) => {showMsg(msg.create,severity.error,summary.error)}
        })
    }

    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar funcionario</h2>}>
            <Head title='Agregar Funcionario'></Head>
            <TitleTemplate>Agregar funcionario</TitleTemplate>
            <Toast ref={toast_global} />
            <ContentTemplate>
                <div>
                    <form onSubmit={submit} className='p-8'>
                        <div className='flex w-full mb-5 gap-10'>
                            <div className="w-full me-5">
                                <InputLabel value={"Ingresa nombres"}></InputLabel>
                                <TextInput type={'text'} className="w-full" placeholder={"Nombre Nombre"} value={data.nombres} onChange={(e) => setData('nombres',e.target.value)} ></TextInput>
                                <InputError message={errors.nombres} className="mt-2" />
                            </div>
                            <div className="w-full">
                                <InputLabel value={"Ingresa apellidos"}></InputLabel>
                                <TextInput type={'text'} className="w-full" placeholder={"Apellido Apellido"} value={data.apellidos} onChange={(e) => setData('apellidos',e.target.value)} ></TextInput>
                                <InputError message={errors.apellidos} className="mt-2" />
                            </div>
                        </div>
                        <div className='w-full flex gap-10'>
                            <Link href={route("funcionario.index")} className='w-full'>
                            <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                            </Link>
                            <Button type='submit' color='primary' variant='ghost' className='w-full'>Agregar</Button>
                        </div>
                    </form>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default AgregarFuncionario
