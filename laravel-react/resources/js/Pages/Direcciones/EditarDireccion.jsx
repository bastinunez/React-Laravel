import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import { Head ,usePage,useForm} from '@inertiajs/react'
import { usePermission } from '@/Composables/Permission';
import { Button } from '@nextui-org/react'
import { Toast } from 'primereact/toast';       
import React,{useRef} from 'react'

const EditarDireccion = ({auth}) => {
    //toast
    const toast_global = useRef(null);
    
    //mensaje formulario
    const severity = { success:'success',error:'error'}
    const summary = { success:'Exito',error:'Error'}
    const showMsg = (msg,sev,sum) => {
        toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
    }

    //PERMISOS
    const {hasRoles,hasPermission} = usePermission()

    //VARIABLES QUE ENTREGA EL CONTROLADOR
    const { direccion } = usePage().props;
    

    //QUEDE AQUI FALTA REALIZAR EL POST, MODIFICAR LOS MENSAJES CON TOAST (ES MEJOR DEJARLO GLOBAL EN EL AUTHENTICAD LAYOUT )


    //formularios
    const { data:data, setData:setData, patch:patch, processing:processing, errors:errors, reset:reset} = useForm({
        nombre: direccion.nombre,
    });

    const submit = (e) => {
        e.preventDefault()
        patch(route('direccion.update',String(direccion.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success);reset()},
            onError: () => {showMsg("Falló",severity.error,summary.error)}
        })
    }


    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar direccion</h2>}>
            <Head title='Editar direccion'></Head>
            <TitleTemplate>Editar direccion</TitleTemplate>
            <Toast ref={toast_global}></Toast>
            <ContentTemplate>
                <div>
                    <div>
                        <form onSubmit={submit} className='p-8'>
                            <div className='flex w-full mb-5 gap-5'>
                                <div className="w-full me-5">
                                    <InputLabel value={"Ingresa nombre"}></InputLabel>
                                    <TextInput type={'text'} className="w-full" placeholder={data.nombre} value={data.nombre} onChange={(e) => setData('nombre',e.target.value)} ></TextInput>
                                    <InputError message={errors.nombre} className="mt-2" />
                                </div>
                            </div>
                            <div>
                                <Button className='w-full' color='primary' variant='ghost' type='submit'>Guardar cambios</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default EditarDireccion
