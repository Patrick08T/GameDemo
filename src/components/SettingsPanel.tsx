import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Settings, X } from 'lucide-react'

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)

  return (
    <>
      <button className="settings-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="settings-overlay" onClick={() => setIsOpen(false)}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>⚙️ 设置</h3>
              <button className="settings-close" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="settings-body">
              <div className="setting-group">
                <label className="setting-label">专注时长</label>
                <div className="setting-slider-row">
                  <input
                    type="range"
                    min={15}
                    max={60}
                    step={5}
                    value={settings.focusDuration / 60}
                    onChange={(e) =>
                      updateSettings({ focusDuration: Number(e.target.value) * 60 })
                    }
                    className="setting-slider"
                  />
                  <span className="setting-value">{settings.focusDuration / 60} 分钟</span>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label">短休息时长</label>
                <div className="setting-slider-row">
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={1}
                    value={settings.shortBreakDuration / 60}
                    onChange={(e) =>
                      updateSettings({ shortBreakDuration: Number(e.target.value) * 60 })
                    }
                    className="setting-slider"
                  />
                  <span className="setting-value">{settings.shortBreakDuration / 60} 分钟</span>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label">长休息时长</label>
                <div className="setting-slider-row">
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={5}
                    value={settings.longBreakDuration / 60}
                    onChange={(e) =>
                      updateSettings({ longBreakDuration: Number(e.target.value) * 60 })
                    }
                    className="setting-slider"
                  />
                  <span className="setting-value">{settings.longBreakDuration / 60} 分钟</span>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label">长休息间隔（轮次）</label>
                <div className="setting-slider-row">
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={1}
                    value={settings.longBreakInterval}
                    onChange={(e) =>
                      updateSettings({ longBreakInterval: Number(e.target.value) })
                    }
                    className="setting-slider"
                  />
                  <span className="setting-value">{settings.longBreakInterval} 轮</span>
                </div>
              </div>

              <div className="setting-group setting-toggle-group">
                <label className="setting-label">声音提醒</label>
                <button
                  className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`}
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                >
                  <span className="toggle-knob" />
                </button>
              </div>

              <div className="setting-group setting-toggle-group">
                <label className="setting-label">浏览器通知</label>
                <button
                  className={`toggle-switch ${settings.notificationEnabled ? 'active' : ''}`}
                  onClick={() => updateSettings({ notificationEnabled: !settings.notificationEnabled })}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
