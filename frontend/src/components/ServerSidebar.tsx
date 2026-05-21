

import '../styles/server_sidebar.css'
import { DMIcon, LogoIcon, PlusIcon } from './Icons'



export interface ServerGroup {
  id: string
  name: string
  avatar_color: string
  unread?: number
}

interface ServerSidebarProps {
  mode: 'dm' | 'group'
  groups: ServerGroup[]
  activeGroupId: string | null
  user: { name: string; avatar_color: string } | null
  onSelectDm: () => void
  onSelectGroup: (id: string) => void
  onAddGroup: () => void
  onUserClick: () => void
  onLogoClick?: () => void
}



function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}



export default function ServerSidebar({
  mode,
  groups,
  activeGroupId,
  user,
  onSelectDm,
  onSelectGroup,
  onAddGroup,
  onUserClick,
  onLogoClick,
}: ServerSidebarProps) {
  return (
    <aside className="server-sidebar">

      {}
      <button className="ss-logo-btn" onClick={onLogoClick} title="HOME">
        <LogoIcon />
      </button>

      {}
      <div className="ss-dm-wrapper">
        <button
          className={`ss-dm-btn ${mode === 'dm' ? 'active' : ''}`}
          onClick={onSelectDm}
        >
          <span className="ss-dm-icon"><DMIcon /></span>
  
        </button>
        <div className="ss-tooltip">DIRECT MESSAGES</div>
      </div>

      <div className="ss-sep" />

      {}
      <div className="ss-groups">
        {groups.map(group => (
          <div key={group.id} className="ss-group-wrapper">

            {activeGroupId === group.id && (
              <div className="ss-active-indicator" />
            )}

            <button
              className={`ss-group-btn ${activeGroupId === group.id ? 'active' : ''}`}
              style={{ background: group.avatar_color }}
              onClick={() => onSelectGroup(group.id)}
            >
              {getInitial(group.name)}

              {group.unread ? (
                <div className="ss-unread">
                  {group.unread > 9 ? '9+' : group.unread}
                </div>
              ) : null}
            </button>

            <div className="ss-tooltip">{group.name.toUpperCase()}</div>
          </div>
        ))}

        {}
        <div className="ss-group-wrapper">
          <button className="ss-add-btn" onClick={onAddGroup} title="ADD SERVER">
            <PlusIcon />
          </button>
          <div className="ss-tooltip">ADD / FIND SERVER</div>
        </div>
      </div>

    </aside>
  )
}