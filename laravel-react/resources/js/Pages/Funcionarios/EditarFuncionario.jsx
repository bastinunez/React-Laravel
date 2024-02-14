import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import { Head ,usePage,useForm,Link} from '@inertiajs/react'
import { usePermission } from '@/Composables/Permission';
import { Button, useDisclosure, Progress,Modal,ModalContent} from '@nextui-org/react'
import { Toast } from 'primereact/toast';       
import React,{useRef} from 'react'

const EditarFuncionario = ({auth}) => {
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
    const { funcionario } = usePage().props;
    
    const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();

    //formularios
    const { data:data, setData:setData, patch:patch, processing:processing, errors:errors, reset:reset} = useForm({
        nombres: funcionario.nombres,
        apellidos: funcionario.apellidos,
    });

    const submit = (e) => {
        e.preventDefault()
        onOpenProgress()
        patch(route('funcionario.update',String(funcionario.id)),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success);reset();onCloseProgress()},
            onError: () => {showMsg("Falló",severity.error,summary.error);onCloseProgress()}
        })
    }


    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar funcionario</h2>}>
            <Head title='Editar Funcionario'></Head>
            <TitleTemplate>Editar Funcionario</TitleTemplate>
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
                        <form onSubmit={submit} className=''>
                            <div className='xl:flex w-full mb-5 xl: gap-5'>
                                <div className="w-full xl:me-5">
                                    <InputLabel value={"Ingresa nombres"}></InputLabel>
                                    <TextInput type={'text'} className="w-full" placeholder={data.nombres} value={data.nombres} onChange={(e) => setData('nombres',e.target.value)} ></TextInput>
                                    <InputError message={errors.nombres} className="mt-2" />
                                </div>
                                <div className="w-full">
                                    <InputLabel value={"Ingresa apellidos"}></InputLabel>
                                    <TextInput type={'text'} className="w-full" placeholder={data.apellidos} value={data.apellidos} onChange={(e) => setData('apellidos',e.target.value)} ></TextInput>
                                    <InputError message={errors.apellidos} className="mt-2" />
                                </div>
                            </div>
                            <div className='flex gap-1'>
                                <Link href={route('funcionario.index')} className='w-full'>
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

export default EditarFuncionario
