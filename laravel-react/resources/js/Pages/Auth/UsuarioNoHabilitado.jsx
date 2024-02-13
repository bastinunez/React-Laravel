import { useForm,Link} from '@inertiajs/react'
import { Button } from '@nextui-org/react'
import React from 'react'

const UsuarioNoHabilitado = () => {
  const {post:postLogOut} = useForm()
  const salir = (e) => {
    postLogOut(route('logout'))
  }
  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <h1>Estás inhabilitado en el sistema</h1>
      <div>
        <Button onPress={salir}>
          Volver a Inicio de sesión
        </Button>
      </div>
    </div>
  )
}

export default UsuarioNoHabilitado
