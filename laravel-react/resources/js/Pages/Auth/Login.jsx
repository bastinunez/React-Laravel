import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import Icon from '@mdi/react';
import { mdiLockOutline,mdiHelpCircle,mdiLockOffOutline } from '@mdi/js';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        rut: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        //console.log("intenta ir")
        post(route('login'),{
            onError: (e) => console.log(e)
        });
    };

    return (
        <GuestLayout>
            <Head title="Inicio sesión" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div className='w-full flex justify-between mb-3'>
                    <h1 className='text-xl'>Iniciar sesión</h1>
                    <Popover 
                        showArrow
                        backdrop="opaque"
                        placement="right"
                        classNames={{
                        base: [  
                            // arrow color
                            "before:bg-default-200"
                        ],
                        content: [
                            "py-3 px-4 border border-default-200",
                            "bg-gradient-to-br from-white to-default-300",
                            "dark:from-default-100 dark:to-default-50",
                        ],
                        }}
                    >
                        <PopoverTrigger>
                        <Button isIconOnly endContent={<Icon path={mdiHelpCircle} size={1} />}></Button>
                        </PopoverTrigger>
                        <PopoverContent>
                        {(titleProps) => (
                            <div className="px-1 py-2">
                            <h3 className="text-medium font-bold" {...titleProps}>
                                ¿Restauraste la contraseña?
                            </h3>
                            <div className="text-small">La contraseña después de restaurar es 12345678</div>
                            </div>
                        )}
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <InputLabel htmlFor="rut" value="Rut" />

                    <TextInput
                        id="rut" placeholder={"XX.XXX.XXX-X"}
                        type="text"
                        name="rut"
                        value={data.rut}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('rut', e.target.value)}
                    />

                    <InputError message={errors.rut} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password" placeholder={"Contraseña..."}
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Recuerdame</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Ingresar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
