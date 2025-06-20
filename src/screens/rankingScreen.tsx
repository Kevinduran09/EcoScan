import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  IonIcon,
} from "@ionic/react"
import type React from "react"
import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../core/firebaseConfig"
import { trophy, medal, ribbon } from "ionicons/icons"
import { useAuth } from "../contexts/authContext"
interface RankingUser {
  id: string
  displayName: string
  totalPoints: number
  level: number
  xp?: number
}

const RankingScreen: React.FC = () => {
  const [ranking, setRanking] = useState<RankingUser[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchRanking = async () => {
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, orderBy("totalPoints", "desc"), limit(30))
      const querySnapshot = await getDocs(q)

      const topUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RankingUser[]

      setRanking(topUsers)
    } catch (error) {
      console.error("Error al obtener ranking:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRanking()
  }, [user])

  const handleRefresh = async (event: CustomEvent) => {
    await fetchRanking()
    event.detail.complete()
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return trophy
      case 2:
        return medal
      case 3:
        return ribbon
      default:
        return null
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return "warning" // Dorado
      case 2:
        return "medium" // Plateado
      case 3:
        return "tertiary" // Bronce
      default:
        return "primary"
    }
  }

  const formatPoints = (points: number) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`
    }
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`
    }
    return points.toString()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>🏆 Ranking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading ? (
          <div className="ion-text-center ion-padding" style={{ marginTop: "50%" }}>
            <IonSpinner name="crescent" />
            <p>Cargando ranking...</p>
          </div>
        ) : (
          <IonList>
            {ranking.length === 0 ? (
              <IonItem>
                <IonLabel>
                  <h2>No hay usuarios con puntos aún</h2>
                  <p>¡Sé el primero en aparecer en el ranking!</p>
                </IonLabel>
              </IonItem>
            ) : (
              ranking.map((rankUser, index) => {
                const position = index + 1
                const isCurrentUser = rankUser.id === user?.uid
                const rankIcon = getRankIcon(position)

                return (
                  <IonItem key={rankUser.id} color={isCurrentUser ? "light" : undefined}>
                    <div slot="start" className="ion-text-center" style={{ minWidth: "40px" }}>
                      {rankIcon ? (
                        <IonIcon icon={rankIcon} color={getRankColor(position)} size="large" />
                      ) : (
                        <IonText color="medium">
                          <strong>#{position}</strong>
                        </IonText>
                      )}
                    </div>

                    <IonLabel>
                      <h2>
                        <strong>
                          {rankUser.displayName || "Usuario anónimo"}
                          {isCurrentUser && (
                            <IonBadge color="success" style={{ marginLeft: "8px" }}>
                              Tú
                            </IonBadge>
                          )}
                        </strong>
                      </h2>
                      <p>
                        Nivel {rankUser.level} • {rankUser.xp || 0} XP
                      </p>
                    </IonLabel>

                    <div slot="end" className="ion-text-end">
                      <IonText color="primary">
                        <h2>
                          <strong>{formatPoints(rankUser.totalPoints)}</strong>
                        </h2>
                      </IonText>
                      <IonText color="medium">
                        <p>puntos</p>
                      </IonText>
                    </div>
                  </IonItem>
                )
              })
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  )
}

export default RankingScreen
