
import { FirebaseAuthentication } from "@capacitor-firebase/authentication"
import { useHistory } from "react-router-dom"
import { useCallback, useState } from "react"
import { auth, authReady } from "../../core/firebaseConfig"
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import Google from '../../components/icons/Google'

const HandleGoogleSignIn = () => {
  const [, setLoading] = useState(false)
  const history = useHistory()

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true)
      
      const result = await FirebaseAuthentication.signInWithGoogle()

      if (result?.user) {
        await authReady

        const credential = await GoogleAuthProvider.credential(result.credential?.idToken)

        const userCredentials = await signInWithCredential(auth, credential)

        console.log(userCredentials);
        
        setLoading(false)
        history.push("/home")
      } else {
        setLoading(false)
        alert("El inicio de sesión con Google falló o fue cancelado.")
      }
    } catch (error: any) {
      setLoading(false)
      alert("Error durante el inicio de sesión con Google: " + error.message)
    }
  }, [history])

 

  return (
   <>
 
    <button
      onClick={signInWithGoogle}
      className="bg-white text-black !border-1 !border-zinc-300 w-full !py-2 !rounded-lg flex justify-center items-center gap-3 hover:bg-gray-300/30 transition-all duration-300 font-medium"
    >
      <Google className="size-6" />
      Continuar con Google
    </button>
   </>
  )
}

export default HandleGoogleSignIn
