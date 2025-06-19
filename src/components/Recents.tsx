import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import { arrowForward, refresh } from 'ionicons/icons';
import Text from './ui/Text';
import { getRecentRecycling, RecyclingItem } from '../services/firebase/RecyclingCacheService';
import { useAuth } from '../contexts/authContext';
import { useHistory } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

export const Recents = () => {
    const { user } = useAuth();
    const history = useHistory();
    const [recentItems, setRecentItems] = useState<RecyclingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadRecentItems();
        }
    }, [user]);

    const loadRecentItems = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const items = await getRecentRecycling(user.uid, 5);
            console.log(items);
            setRecentItems(items);
        } catch (error) {
            console.error('Error loading recent items:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (timestamp: Timestamp) => {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
        console.log(date.toISOString());
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'hace 1h';
        if (diffInHours < 24) return `hace ${diffInHours}h`;
        if (diffInHours < 48) return 'hace 1d';
        return `hace ${Math.floor(diffInHours / 24)}d`;
    };

    const getTypeIcon = (tipo: string) => {
        const icons: Record<string, string> = {
            'plastic': '🥤',
            'glass': '🍶',
            'paper': '📄',
            'metal': '🥫',
            'organic': '🍎',
            'cardboard': '📦'
        };
        return icons[tipo.toLowerCase()] || '♻️';
    };

    const handleViewAll = () => {
        history.push('/recent-recycling');
    };

    const handleRefresh = () => {
        loadRecentItems();
    };

    return (
        <div className='space-y-4'>
            <div className='flex flex-row justify-between items-center'>
                <Text
                    size='xl'
                    weight='semibold'
                >
                    Reciclaje Reciente
                </Text>
                <div className='flex gap-2'>
                    <Button
                        icon={refresh}
                        size='sm'
                        variant='ghost'
                        className='text-white bg-white/10 !rounded-full p-2'
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        Actualizar
                    </Button>
                    <Button
                        iconPosition='right'
                        size='sm'
                        variant='ghost'
                        className='text-white bg-white/10 !rounded-full p-2'
                        icon={arrowForward}
                        onClick={handleViewAll}
                    >
                        Ver todos
                    </Button>
                </div>
            </div>

            <div className='flex overflow-x-auto h-auto'
                style={{
                    scrollbarWidth: 'none'
                }}
            >
                {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, n) => (
                        <div key={n} className="story-item bg-white overflow-hidden rounded-xl !w-36 animate-pulse">
                            <div className="h-32 bg-gray-200"></div>
                            <div className="p-2 space-y-1">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))
                ) : recentItems.length === 0 ? (
                    // Empty state
                    <div className="w-full text-center py-8">
                        <div className="text-4xl mb-2">♻️</div>
                        <Text size="sm" color="gray">
                            No hay reciclajes recientes
                        </Text>
                    </div>
                ) : (
                    // Real data
                    recentItems.map((item) => (
                        <div key={item.id} className="story-item bg-white overflow-hidden rounded-xl !w-36">
                            <div className="h-32 relative">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.tipo}
                                    className="h-full w-full object-cover" 
                                />
                                <div className='absolute top-0 right-0 m-3 bg-orange-500 rounded-full size-6 flex justify-center items-center'>
                                    <span className="text-xs">
                                        {getTypeIcon(item.tipo)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-left p-2 space-y-1">
                                <Text
                                    size='base'
                                    color='black'
                                    weight='semibold'
                                >
                                    {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                                </Text>
                                <Text
                                    color='gray'
                                    size='sm'
                                    weight='medium'
                                >
                                    {formatTimeAgo(item.timestamp)}
                                </Text>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
