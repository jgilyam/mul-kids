import { useState } from 'react'
import { useUser } from './hooks/useUser'
import RegisterView from './components/views/RegisterView'
import GameView from './components/views/GameView'
import ProgressView from './components/views/ProgressView'
import HistoryView from './components/views/HistoryView'
import ProfileView from './components/views/ProfileView'
import Header from './components/layout/Header'
import TabNavigation from './components/layout/TabNavigation'
import styles from './App.module.css'

function App() {
  const { user, isRegistered } = useUser()
  const [activeTab, setActiveTab] = useState('play')

  const tabs = [
    { id: 'play', label: 'Jugar' },
    { id: 'progress', label: 'Progreso' },
    { id: 'history', label: 'Historial' },
    { id: 'profile', label: 'Perfil' }
  ]

  if (!isRegistered) {
    return <RegisterView />
  }

  return (
    <div>
      <Header userName={user?.name} />
      <main className={styles.main}>
        {activeTab === 'play' && <GameView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
