"use client"

import { IonIcon, IonLoading } from "@ionic/react"
import { eye, eyeOff } from "ionicons/icons"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../core/firebaseConfig"
import { useHistory } from "react-router-dom"
import { useAuth } from "../contexts/authContext"

const RegisterForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const { setRegistrationData } = useAuth()

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleRegister = async () => {
    setError(null)

    if (!email || !password || !name) {
      setError("Por favor, completa todos los campos.")
      return
    }

    if (!isValidEmail(email)) {
      setError("El correo electrónico no es válido.")
      return
    }

    try {
      setLoading(true)
      
      // Establecer los datos de registro en el contexto antes de crear el usuario
      setRegistrationData({ displayName: name })
      
      // Crear el usuario
      await createUserWithEmailAndPassword(auth, email, password)
      
      // El authContext se encargará de crear el perfil con los datos correctos
      history.push("/home")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage)
      console.error(errorMessage)
    }

    setLoading(false)
  }

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 text-md font-bold text-gray-700">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 p-2.5 w-full"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-md font-bold text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`bg-gray-50 border-2 ${email ? (isValidEmail(email) ? "border-green-500" : "border-red-500") : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-green-600 p-2.5 w-full`}
            placeholder="Tu correo"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-md font-bold text-gray-700">
            Contraseña
          </label>
          <div className="relative flex items-center">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-gray-50 border-2 ${password ? "border-green-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:border-zinc-600 p-2.5 w-full`}
              placeholder="Contraseña"
              required
            />
            <IonIcon
              className="absolute right-5 cursor-pointer text-zinc-400 size-5"
              onClick={togglePasswordVisibility}
              icon={isPasswordVisible ? eye : eyeOff}
            ></IonIcon>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleRegister}
          className="bg-green-700 text-white w-full !py-4 !rounded-lg hover:bg-green-800 transition duration-300 font-medium"
          disabled={loading}
        >
          Registrarse
        </button>

        <IonLoading isOpen={loading} message="Creando cuenta..." />
      </div>
    </div>
  )
}

export default RegisterForm
