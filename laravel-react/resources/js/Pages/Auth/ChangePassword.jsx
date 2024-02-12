import { useForm,usePage } from '@inertiajs/react';
import { Button, Input, useDisclosure, Modal,ModalBody, ModalContent, ModalHeader, ModalFooter } from '@nextui-org/react';
import React,{useState, useRef} from 'react'
import Icon from '@mdi/react';
import { mdiLockOutline,mdiHelpCircle,mdiLockOffOutline } from '@mdi/js';
import { Toast } from 'primereact/toast';
import InputError from '@/Components/InputError';

const ChangePassword = ({auth}) => {
  //toast
  const toast_global = useRef(null);
  //mensaje formulario
  const severity = { success:'success',error:'error'}
  const summary = { success:'Exito',error:'Error'}
  const showMsg = (msg,sev,sum) => {
      toast_global.current.show({severity:sev, summary:sum, detail:msg, life: 3000});
  }

  const {flash} = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    current_password:'',
    nueva_pwd:'',
  });
  const {post:postLogOut} = useForm()
  const [isVisible, setIsVisible] = React.useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isDisabled,setIsDisabled] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible);
  const submit = (e) => {
    setIsDisabled(false)
    post(route('usuario.change_pwd'),{
      onSuccess: (msg)=> {showMsg(msg.update,severity.success,summary.success);},
      onError: (msg) => {showMsg(msg.update,severity.error,summary.error)},
    })
  }
  const salir = (e) => {
    postLogOut(route('logout'))
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <Toast ref={toast_global}></Toast>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
        {(onClose) => (
              <>
              <ModalHeader className="flex flex-col gap-1">Cambiar contraseña</ModalHeader>
              <ModalBody>
                  <p> 
                      Confirma cambiar la contraseña por: {data.nueva_pwd}
                  </p>
              </ModalBody>
              <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                      Cancelar
                  </Button>
                  <Button color="primary" onPress={onClose} onClick={submit}>
                      Confirmar
                  </Button>
              </ModalFooter>
              </>
          )}
        </ModalContent>
      </Modal>
      <div className='p-3  w-full max-w-sm border-2'>
        <div className='mb-3 flex justify-between'>
          <h1 className='text-large'>Cambiar contraseña</h1>
          
        </div>
        <Input autoFocus endContent={
          <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
            {isVisible ? (
              <Icon path={mdiLockOutline} size={1} />
            ) : (
              <Icon path={mdiLockOffOutline} size={1} />
            )}
          </button>
        }
        classNames={{input:"border-0",label:'mb-2'}} 
          label="Contraseña por defecto" placeholder="12345678" value={data.current_password} onChange={(e) => setData('current_password',e.target.value)}
          variant="bordered" type={isVisible ? "text" : "password"} className=""
        />
        <InputError message={errors.current_password} className="mt-2" />
        <Input endContent={ <Icon path={mdiLockOutline} size={1} /> } value={data.nueva_pwd} onChange={(e) => setData('nueva_pwd',e.target.value)}
          label="Password" placeholder="Ingrese nueva contraseña"
          type="password" variant="bordered" className="mt-2" classNames={{input:"border-0",label:'mb-2'}} 
        />
        <InputError message={errors.nueva_pwd} className="mt-2" />
      <div className='w-full flex gap-2 mt-2'>
        <Button onClick={salir} className='w-full'  color='warning'>Salir</Button>
        <Button onClick={onOpen} className='w-full' color='success'>Confirmar</Button>
      </div>
      </div>
      
    </div>
  )
}

export default ChangePassword
