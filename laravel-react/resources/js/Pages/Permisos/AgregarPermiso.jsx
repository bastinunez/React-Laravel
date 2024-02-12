import ContentTemplate from '@/Components/ContentTemplate'
import TitleTemplate from '@/Components/TitleTemplate'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput'
import { Head, useForm, Link, usePage} from '@inertiajs/react'
import { Button,useDisclosure,Progress,Modal,ModalContent } from '@nextui-org/react'
import { Toast } from 'primereact/toast';        
import React,{useRef} from 'react'

const AgregarPermiso = ({auth}) => {
    //toast
    const toast_global = useRef(null);
    
    //mensaje formulario
    const severity = { success:'success',error:'error'}
    const summary = { success:'Exito',error:'Error'}
    const showMsg = (msg,sev,sum) => {
        toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
    }

    const {isOpen:isOpenProgress, onOpen:onOpenProgress, onClose:onCloseProgress} = useDisclosure();

    //formularios
    const { data:data, setData:setData, post:post, processing:processing, errors:errors, reset:reset} = useForm({
        nombre: '',
    });

    const submit = (e) => {
        e.preventDefault()
        onOpenProgress()
        post(route('permiso.store'),{
            onSuccess: () => {showMsg("Exito",severity.success,summary.success);onCloseProgress()},
            onError:() => {showMsg("Falló",severity.error,summary.error);onCloseProgress()}
        })
    }

    return (
        <Authenticated user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar permiso</h2>}>
            <Head title='Agregar permiso'></Head>
            <TitleTemplate>Agregar permiso</TitleTemplate>
            <Toast ref={toast_global} />
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
                    <form onSubmit={submit} className=''>
                        <div className=' w-full mb-5 gap-10'>
                            <InputLabel value={"Ingresa nombre"}></InputLabel>
                            <TextInput type={'text'} className="w-full" placeholder={"Nombre"} value={data.nombre} 
                            onChange={(e) => setData('nombre',e.target.value)} ></TextInput>
                            <InputError message={errors.nombre} className="mt-2" />
                        </div>
                        <div className='w-full flex gap-3'>
                            <Link href={usePage().props.ziggy.previous} className='w-full'>
                                <Button className='w-full text-large' color='warning' variant='ghost' >Volver atrás</Button>
                            </Link>
                            <Button type='submit' color='primary' variant='ghost' className='w-full text-large'>Agregar</Button>
                        </div>
                    </form>
                </div>
            </ContentTemplate>
        </Authenticated>
    )
}

export default AgregarPermiso
