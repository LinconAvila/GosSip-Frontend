import { useState } from 'react'
import UserPanel from '../components/UserPanel'
import GroupModal from '../components/GroupModal'
import MemberPanel from '../components/MemberPanel'

export default function TestPage() {
  const [memberPanelOpen, setMemberPanelOpen] = useState(true)
  const [userPanelOpen, setUserPanelOpen] = useState(true)
  const [groupModalOpen, setGroupModalOpen] = useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-main)',
        display: 'flex',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1 }} />


      <MemberPanel
        isOpen={memberPanelOpen}
        onClose={() => setMemberPanelOpen(false)}
        members={[]}
        roomName="Sala Teste"
      />

      <UserPanel
        isOpen={userPanelOpen}
        onClose={() => setUserPanelOpen(false)}
      />


      <GroupModal
        isOpen={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
      />



      <button onClick={() => setGroupModalOpen(true)}>
  Abrir modal
</button>
    </div>



  )


  
}