import React from 'react'
import Button from './ui/Button'
import { arrowForward } from 'ionicons/icons'
import Text from './ui/Text'

export const Recents = () => {
    return (
        <div className='space-y-4'>
            <div className='flex flex-row justify-between items-center'>
                <Text
                    size='xl'
                    weight='semibold'
                >
                    Reciclaje Reciente
                </Text>
                <Button
                    iconPosition='right'
                    size='sm'
                    variant='ghost'
                    className='text-white bg-white/10 !rounded-full p-2'
                    icon={arrowForward}
                >
                    Ver todos
                </Button>
            </div>

            <div className='flex overflow-x-auto  h-auto '
                style={{
                    scrollbarWidth: 'none'
                }}
            >
                {
                    Array.from({ length: 5 }).map((_, n) => (
                        <div key={n} className="story-item bg-white overflow-hidden rounded-xl !w-36">
                            <div className="h-32 relative">
                                <img src='https://static.nationalgeographic.es/files/styles/image_3200/public/02_bottle_mm9070_190418_2431-1-gif.gif?w=1900&h=2763' className="h-full w-full object-center" />
                                <div className='absolute top-0 right-0 m-3  bg-orange-500 rounded-full size-6 flex justify-center items-center'>
                                    <span>
                                        📦
                                    </span>
                                </div>
                            </div>
                            <div className=" text-left p-2 space-y-1">
                                <Text
                                    size='base'
                                    color='black'
                                    weight='semibold'
                                >
                                    Organicos
                                </Text>
                                <Text
                                    color='gray'
                                    size='sm'
                                    weight='medium'
                                >
                                    hace 2d
                                </Text>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
