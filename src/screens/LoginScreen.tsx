import { IonContent, IonPage } from '@ionic/react'
import React from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import Title from '../components/ui/Title'
import Text from '../components/ui/Text'
import Facebook from '../components/icons/Facebook'
import HandleGoogleSignIn from '../components/firebase/authentication'
const LoginScreen = () => {
    const [toogleForm, setToogleForm] = React.useState(false)
    const [formType, setFormType] = React.useState('login')

    const handleToogleForm = () => {
        setToogleForm(!toogleForm)
        setFormType(toogleForm ? 'login' : 'register')
    }
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='flex flex-col justify-center items-center h-screen'>
                    <div className="space-y-4 w-full px-12">
                        <div className="text-center mb-12">
                            <Title variant="h1" color="black" className="!font-bold ">
                                {formType === "login" ? "Iniciar Sesión" : "Registro"}
                            </Title>
                            <Text className="text-zinc-800/80">
                                {formType === "login" ? "¿No tienes cuenta? " : "¿Ya tienes una cuenta? "}
                                <button className="text-black underline" onClick={handleToogleForm}>
                                    {formType === "login" ? "Registrate" : "Inicia sesión"}
                                </button>
                            </Text>
                        </div>


                        {/* Fomrulario dinamico */}
                        {formType === 'login' ? (
                            <LoginForm />
                        ) : (
                            <RegisterForm />
                        )}

                        <div className="relative">
                            <div className='absolute inset-0 flex items-center'>
                                <div className='pt-0.5 bg-gray-200 w-full'></div>
                            </div>
                            <div className='relative flex justify-center'>
                                <span className='text-gray-500 bg-white px-3'>O</span>
                            </div>

                        </div>

                        {/* Google */}
                        <HandleGoogleSignIn />
                        
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default LoginScreen

