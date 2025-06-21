import React from 'react'
import Card from './ui/Card'
import { IonIcon } from '@ionic/react'
import { leaf, time } from 'ionicons/icons'
import Text from './ui/Text'
import { Mission } from '../types/Mission'
import { getDayLong, getTimeLeftUntil } from '../utils/timeDecorations'
import { useHistory } from 'react-router'
interface Props {
    mission: Mission
}
export const MissionCard: React.FC<Props> = ({ mission }) => {
    const history = useHistory();
    const { type, progresoActual, target, xp, fechaExpiracion, description } = mission
    
    const title = (() => {

        if (type === 'material_recycle') {
            return "¡Meta Diaria!"
        } else if (type === 'item_category') {
            return `${getDayLong()} de ${mission.material}`
        } else if (type === 'count_recycle') {
            return '¡Dia Productivo!'
        }
        return ''
    })()
    // Progreso visual
    const porcentaje = Math.min(100, Math.floor((progresoActual / target) * 100))

    return (
        <Card variant="solid" className="space-y-4">
            {/* parte superior */}
            <div className="flex justify-between">
                <div className="flex justify-center items-center gap-3">
                    <IonIcon className="size-6 bg-orange-700/10 p-2 rounded-full text-orange-600" icon={leaf} />
                    <div>
                        <Text className='capitalize' color="black" size="base" weight="bold">
                            {title}
                        </Text>
                        <Text color="gray" size="sm">
                            {description}
                        </Text>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <span className="flex justify-center items-center gap-1 bg-black/10 py-1 px-2 rounded-full text-zinc-600 text-sm font-medium text-nowrap">
                        <IonIcon className="size-5" icon={time} />
                        {getTimeLeftUntil(typeof fechaExpiracion === 'string' ? new Date(fechaExpiracion) : fechaExpiracion)}
                    </span>
                </div>
            </div>

            {/* parte inferior */}
            <div className="space-y-4">
                {/* progreso */}
                <div className="flex flex-row items-center gap-2">
                    <div className="h-2 w-full bg-zinc-300 rounded-full">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                    </div>
                    <span className="font-semibold">
                        {progresoActual}/{target}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-zinc-500">🎁 +{xp} xp</span>
                    <div>
                        <button
                            onClick={() => history.push('/camera')}
                            className="!rounded-full !p-2 text-white font-semibold bg-gradient-to-r from-orange-600 to-orange-300">
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
