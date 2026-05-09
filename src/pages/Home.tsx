import CatPet from '@/components/CatPet'
import PomodoroTimer from '@/components/PomodoroTimer'
import AffectionBar from '@/components/AffectionBar'
import ActionButtons from '@/components/ActionButtons'
import EncounterModal from '@/components/EncounterModal'
import SettingsPanel from '@/components/SettingsPanel'
import TimeStatus from '@/components/TimeStatus'

export default function Home() {
  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-title">
          <span className="app-title-emoji">🐱</span>
          喵喵番茄钟
        </div>
        <SettingsPanel />
      </div>

      <div className="main-content">
        <TimeStatus />
        <CatPet />
        <PomodoroTimer />
        <AffectionBar />
        <ActionButtons />
      </div>

      <EncounterModal />
    </div>
  )
}
