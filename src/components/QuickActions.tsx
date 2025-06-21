import { IonIcon } from '@ionic/react';
import { camera, time, trophy, notifications } from 'ionicons/icons';
import Card from './Card';
import Title from './ui/Title';
import Text from './ui/Text';
import { Link } from 'react-router-dom';

const actions: Array<{
  icon: string;
  color: string;
  title: string;
  description: string;
  to: string;

}> = [
    {
      icon: camera,
      color: '#4CAF50',
      title: 'Escanear',
      description: 'Escanea productos para ganar puntos',
    to: '/camera',

    },
    {
      icon: time,
      color: '#2778e9',
      title: 'Historial',
      description: 'Mira tu historial de reciclaje',
      to: '/history',

    },
    {
      icon: notifications,
      color: '#efa511',
      title: 'Notificaciones',
      description: 'Consulta todas tus notificaciones',
      to: '/notifications',

    },
    {
      icon: trophy,
      color: '#a113ad',
      title: 'Perfil',
      description: 'Revisa tus logros y puntos ganados',
      to: '/profile',
   
    },
  ];

const QuickActions = () => {
  return (
    <div className='mt-8'>
      <Title variant="h2" color="white" className="mb-3">Acciones Rápidas</Title>
      <div className='grid grid-cols-2 gap-3'>
        {actions.map((action) => (
          <Card className='py-2' key={action.title}>
            <Link to={action.to}>
              <div className='flex flex-col items-center justify-center p-3 text-center'>
                <IonIcon icon={action.icon} className={`text-[${action.color}] bg-[${action.color}]/20 p-3 rounded-full size-8 mb-2`} style={{ color: action.color, backgroundColor: action.color + '20' }} />
                <Text size='lg' color="black" weight="semibold">{action.title}</Text>
                <Text size='base' color="gray">{action.description}</Text>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default QuickActions