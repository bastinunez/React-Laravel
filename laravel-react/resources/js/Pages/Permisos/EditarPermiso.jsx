import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import { Head ,usePage,useForm,Link} from '@inertiajs/react'
import { usePermission } from '@/Composables/Permission';
import { Button,useDisclosure,Progress,Modal,ModalContent } from '@nextui-org/react'
import { Toast } from 'primereact/toast';       
import React,{useRef} from 'react'

const EditarPermiso = ({auth}) => {
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

    //VARIABLES QUE ENTREGA EL CONTpermisoADOR
    const { permiso } = usePage().props;

    //QUEDE AQUI FALTA REALIZAR EL POST, MODIFICAR LOS MENSAJES CON TOAST (ES MEJOR DEJARLO GLOBAL EN EL AUTHENTICAD LAYOUT )


    //formularios
    const { data:data, setData:setData, patch:patch, processing:processing, errors:errors, reset:reset} = useForm({
        nombre: permiso.name,
    });

    const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();

    const submit = (e) => {
        e.preventDefault()
        onOpenProgress()
        patch(route('permiso.update',String(permiso.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success);onCloseProgress()},
            onError: () => {showMsg("Falló",severity.error,summary.error);onCloseProgress()}
        })
    }


    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar permiso</h2>}>
            <Head title='Editar permiso'></Head>
            <TitleTemplate>Editar permiso</TitleTemplate>
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
                                <Link href={route("permiso.index")} className='w-full'>
                                    <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                                </Link>
                                <Button className='w-full text-large' color='primary' variant='ghost' type='submit'>Guardar cambios</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default EditarPermiso
