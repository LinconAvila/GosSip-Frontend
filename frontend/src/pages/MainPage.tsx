

import { useEffect, useState, useRef, useCallback } from 'react'
import type { RoomResponse } from '../types'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useRooms } from '../hooks/useRooms'
import { useInbox } from '../hooks/useInbox'
import { useDmConversations, useDmHistory } from '../hooks/useDm'
import { useWsRoom } from '../hooks/useWsRoom'
import { useWsInbox } from '../hooks/useWsInbox'
import { usePresence } from '../hooks/usePresence'
import { usePresenceStore } from '../store/presenceStore'
import ServerSidebar, { type ServerGroup } from '../components/ServerSidebar'
import ContextSidebar, { type DmEntry, type GroupInfo } from '../components/ContextSidebar'
import ChatArea from '../components/ChatArea'
import MemberPanel from '../components/MemberPanel'
import TerminalPanel from '../components/TerminalPanel' 
import UserPanel from '../components/UserPanel'
import ProfileBar from '../components/ProfileBar'
import GroupModal from '../components/GroupModal'
import AddFriendModal from '../components/AddFriendModal'
import InviteUserModal from '../components/InviteUserModal'
import { useFriends } from '../hooks/useFriends'
import { getRoomMembers } from '../api/rooms'
import { searchUsers } from '../api/users'
import { listRoomMembers } from '../api/rooms'
import FriendsDashboard from '../components/FriendsDashboard'
import ChatTopbar from '../components/ChatTopbar'

import '../styles/main_page.css'



function colorFromName(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

function toServerGroup(room: RoomResponse): ServerGroup {
  return {
    id:           room.id,
    name:         room.name,
    avatar_color: colorFromName(room.name),
    unread:       undefined,
  }
}

function toGroupInfo(room: RoomResponse, currentUsername: string): GroupInfo {
  return {
    id:           room.id,
    name:         room.name,
    avatar_color: colorFromName(room.name),
    member_count: 0,
    online_count: 0,
    is_admin:     room.owner_username === currentUsername,
  }
}



type DmTab = 'friends' | 'pending' | 'add'



export default function MainPage() {
  const navigate    = useNavigate()
  const storeUser   = useAuthStore(s => s.user)

  
  const [mode,            setMode]            = useState<'dm' | 'group'>('dm')
  const [activeGroupId,   setActiveGroupId]   = useState<string | null>(null)
  const [activeDmUser,    setActiveDmUser]    = useState<string | null>(null)
  const [dmTab, setDmTab] = useState<'friends' | 'pending' | 'add' | null>(null)
  const [membersOpen,     setMembersOpen]     = useState(true)
  const [terminalOpen,    setTerminalOpen]    = useState(false) 
  const [userPanelOpen,   setUserPanelOpen]   = useState(false)
  const [groupModalOpen,  setGroupModalOpen]  = useState(false)
  const [addFriendOpen,   setAddFriendOpen]   = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  

  const { friends, pending, addFriend, respond: respondFriendRequest, removeFriend, fetchAll: fetchFriends } = useFriends()
  const { conversations, fetchConversations } = useDmConversations()

  
  const {
    messages:     dmMessages,
    sendMessage:  sendDmMessage,
    sendReact:    sendDmReact,
    sendTyping:   sendDmTyping,
    isTyping:     isDmTyping,
    wsRef:        dmWsRef,
  } = useDmHistory(mode === 'dm' ? activeDmUser : null, fetchConversations)

  const {
    messages:     roomMessages,
    sendMessage:  sendRoomMessage,
    sendReact:    sendRoomReact,
    sendTyping:   sendRoomTyping,
    onlineCount:  roomOnlineCount,
    typingUsers:  roomTypingUsers,
    onlineUsers:  roomOnlineUsers, 
    wsRef:        roomWsRef,
  } = useWsRoom(mode === 'group' ? activeGroupId : null)

  const [activeRoomMembers, setActiveRoomMembers] = useState<any[]>([])
  
  
  useEffect(() => {
    if (mode === 'group' && activeGroupId) {
      getRoomMembers(activeGroupId)
        .then(data => {
          if (Array.isArray(data)) {
            setActiveRoomMembers(data)
          } else {
            setActiveRoomMembers([])
          }
        })
        .catch(err => {
          console.error("Erro ao buscar membros:", err)
          setActiveRoomMembers([])
        })
    } else {
      setActiveRoomMembers([])
    }
  }, [activeGroupId, mode, roomOnlineCount])

  const {
    notifications,
    sentRoomInvites,
    fetchInbox,
    fetchSentRoomInvites,
    cancelRoomInvite,
    acceptFriend,
    declineFriend,
    acceptInvite,
    declineInvite,
  } = useInbox(fetchFriends)

  const {
    myRooms,
    fetchMyRooms,
    handleCreateGroup,
    handleSearchGroups,
    handleJoinGroup,
    handleRequestJoin,
    inviteUserToRoom,
    handleLeaveGroup,  
    handleDeleteGroup  
  } = useRooms()

  

  const friendUsernames = friends.map(f =>
    f.sender_username === storeUser?.username
      ? f.recipient_username
      : f.sender_username
  )

  const handlePresenceEventRef = useRef<((data: any) => void) | undefined>(undefined)

  const inboxWsRef = useWsInbox(
    () => {
      fetchInbox()
      fetchFriends()
      fetchConversations()
      fetchMyRooms()
      fetchSentRoomInvites() 
    },
    (e) => handlePresenceEventRef.current?.(e),
  )

  const sendStatusViaActiveWs = useCallback((payload: object) => {
    if (mode === 'group' && roomWsRef?.current) {
      roomWsRef.current.send(payload)
    } else if (mode === 'dm' && dmWsRef?.current) {
      dmWsRef.current.send(payload)
    } else if (inboxWsRef?.current) {
      inboxWsRef.current.send(payload)
    }
  }, [mode, roomWsRef, dmWsRef, inboxWsRef])

  const { myStatus, setMyStatus, handlePresenceEvent } = usePresence(
    sendStatusViaActiveWs,
    friendUsernames,
  )

  useEffect(() => {
    handlePresenceEventRef.current = handlePresenceEvent
  }, [handlePresenceEvent])

  const presences = usePresenceStore(s => s.presences)

  useEffect(() => { fetchMyRooms() }, [fetchMyRooms])

  

  const currentUser = {
    name:         storeUser?.name         ?? '',
    username:     storeUser?.username     ?? '',
    avatar_color: storeUser?.avatar_color ?? '#247BA0',
  }

  const groups: ServerGroup[] = myRooms.map(toServerGroup)

  const activeRoomData = activeGroupId
    ? myRooms.find(r => r.id === activeGroupId) ?? null
    : null

  const isCurrentRoomOwner = activeRoomData?.owner_username === currentUser.username;

  
  const liveOnlineCount = activeRoomMembers.filter(m => {
    const uname = m.username || m.user?.username || m.user_username || m.peer_username;
    if (!uname) return false;
    if (uname === currentUser.username) return myStatus !== 'offline';
    
    
    const isConnectedToRoomWs = roomOnlineUsers?.includes(uname);
    const peer = presences[uname];
    const isPresenceInRoom = peer && peer.roomId === activeGroupId && peer.status !== 'offline';
    
    return isConnectedToRoomWs || isPresenceInRoom;
  }).length;

  
  const finalOnlineCount = activeRoomMembers.length > 0 ? liveOnlineCount : (roomOnlineCount > 0 ? roomOnlineCount : 1);

  
  const finalMemberCount = activeRoomMembers.length > 0 
    ? activeRoomMembers.length 
    : ((activeRoomData as any)?.member_count || (activeRoomData as any)?.members?.length || finalOnlineCount || 1);

  
  const enrichedRoomMembers = activeRoomMembers.map(m => {
    const uname = m.username;
    if (uname === currentUser.username) {
      return { 
        ...m, 
        is_online: myStatus !== 'offline', 
        status: myStatus 
      };
    }
    
    const peer = presences[uname];
    const isConnectedToRoomWs = roomOnlineUsers?.includes(uname);
    const isPresenceInRoom = peer && peer.roomId === activeGroupId && peer.status !== 'offline';
    
    
    const isMemberActiveHere = isConnectedToRoomWs || isPresenceInRoom;
    
    
    const liveStatus = isMemberActiveHere ? (peer?.status ?? 'online') : 'offline';
    
    return { 
      ...m, 
      is_online: liveStatus !== 'offline', 
      status: liveStatus 
    };
  });

  const activeGroup: GroupInfo | null = activeRoomData
    ? {
        ...toGroupInfo(activeRoomData, currentUser.username),
        online_count: finalOnlineCount,
        member_count: finalMemberCount,
      }
    : null

  const chatMode: 'dm' | 'group' | 'empty' =
    mode === 'dm'    && activeDmUser  ? 'dm'    :
    mode === 'group' && activeGroupId ? 'group' : 'empty'

  const chatTitle =
    chatMode === 'dm'    ? activeDmUser ?? ''        :
    chatMode === 'group' ? (activeGroup?.name ?? '') : ''

  const chatSubtitle =
    chatMode === 'group'
      ? `${activeGroup?.online_count ?? 0} online — ${activeGroup?.member_count ?? 0} members`
      : chatMode === 'dm' ? 'direct message' : ''

  const displayUsernames = new Set(conversations.map(c => c.with_username))

  if (activeDmUser && mode === 'dm') {
    displayUsernames.add(activeDmUser)
  }

  const realDms: DmEntry[] = Array.from(displayUsernames).map(username => {
    const conv = conversations.find(c => c.with_username === username)
    const friendData = friends.find(f => f.sender_username === username || f.recipient_username === username)

    const peer = presences[username]
    const status = peer?.status ?? 'offline'

    const activeRoom = peer?.roomId ? myRooms.find(r => r.id === peer.roomId) : null
    const finalRoomName = peer?.roomName || (peer?.roomId ? (activeRoom ? activeRoom.name : 'A SERVER') : null)

    let statusText = 'Offline'
    if (status !== 'offline') {
      const statusNames = { online: 'Online', idle: 'Idle', dnd: 'Do Not Disturb' }
      statusText = statusNames[status as keyof typeof statusNames] || 'Online'
    }

    const realName = (friendData as any)?.friend_name || (friendData as any)?.name || username
    const realColor = (friendData as any)?.friend_avatar_color || (friendData as any)?.avatar_color || colorFromName(username)

    return {
      username:     username,
      name:         realName,
      avatar_color: realColor,
      status:       status as 'online' | 'idle' | 'offline' | 'dnd',
      last_message: conv?.last_message || statusText,
      room_name:    finalRoomName,
      unread:       conv?.unread_count || 0,
    }
  })

  

  const handleAcceptFriend = async (id: string) => {
    await acceptFriend(id)
    fetchFriends()
  }

  const handleDeclineFriend = async (id: string) => {
    await declineFriend(id)
    fetchFriends()
  }

  const handleAcceptInvite = async (id: string) => {
    await acceptInvite(id)
    fetchMyRooms() 
  }

  const handleDeclineInvite = async (id: string) => {
    await declineInvite(id)
    fetchMyRooms()
  }

  const handleGroupCreated = (room: RoomResponse) => {
    setGroupModalOpen(false)
    setMode('group')
    setActiveGroupId(room.id)
    setActiveDmUser(null)
  }

  const handleSelectGroup = (id: string) => {
    setMode('group')
    setActiveGroupId(id)
    setActiveDmUser(null)
  }

  const handleSelectDm = (username: string) => {
    setActiveDmUser(username)
    setDmTab(null)
    setMode('dm')
    setActiveGroupId(null)
  }

  const handleModeSwitch = () => {
    setMode('dm')
    setActiveGroupId(null)
  }

  const handleToggleTab = (tab: DmTab) => {
    if (tab === 'add') { setAddFriendOpen(true); return; }
    setDmTab(tab)
    setActiveDmUser(null)
    setMode('dm')
    setActiveGroupId(null)
  }

  const handleCancelRequest = async (id: string) => {
    await respondFriendRequest(id, 'declined')
    fetchFriends()
  }

  const handleRemoveFriend = async (username: string) => {
    const target = friends.find(f => f.sender_username === username || f.recipient_username === username)
    if (!target) return
    if (!confirm(`Pretende remover @${username} da sua lista de amigos?`)) return

    await removeFriend(target.id)
    fetchFriends()
    fetchConversations()
    if (activeDmUser === username) setActiveDmUser(null)
  }

  

  const totalPendingCount = pending.length + notifications.filter((n: any) => n.type === 'group_invite').length + sentRoomInvites.length

  return (
    <div className="main-page">

      <ServerSidebar
        mode={mode}
        groups={groups}
        activeGroupId={activeGroupId}
        user={currentUser}
        onSelectDm={handleModeSwitch}
        onSelectGroup={handleSelectGroup}
        onAddGroup={() => setGroupModalOpen(true)}
        onUserClick={() => setUserPanelOpen(true)}
        onLogoClick={() => {
          setActiveGroupId(null)
          setActiveDmUser(null)
          setDmTab(null)
          setMode('dm')
        }}
      />

      <ContextSidebar
        mode={mode}
        dms={realDms}
        activeDmUsername={activeDmUser}
        pendingCount={totalPendingCount}
        activeTab={dmTab}
        onSelectDm={handleSelectDm}
        onTabChange={handleToggleTab}
        groupInfo={activeGroup}
        onInviteUser={() => setInviteModalOpen(true)}
        user={currentUser}
        onUserPanelOpen={() => setUserPanelOpen(true)}
        onSettingsOpen={() => navigate('/settings')}
        roomId={mode === 'group' ? (activeGroupId ?? undefined) : undefined}
        isOwner={isCurrentRoomOwner}
        onLeaveGroup={async (id) => {
          const success = await handleLeaveGroup(id);
          if (success) { setActiveGroupId(null); setMode('dm'); setDmTab('friends'); }
        }}
        onDeleteGroup={async (id) => {
          const success = await handleDeleteGroup(id);
          if (success) { setActiveGroupId(null); setMode('dm'); setDmTab('friends'); }
        }}
      />

      <div className="main-right-slot">
        {(mode === 'dm' && activeDmUser) || (mode === 'group' && activeGroupId) ? (
          <ChatArea
            mode={chatMode}
            title={chatTitle}
            subtitle={chatSubtitle}
            membersOpen={membersOpen}
            onToggleMembers={() => setMembersOpen(v => !v)}
            terminalOpen={terminalOpen}                            
            onToggleTerminal={() => setTerminalOpen(v => !v)}      
            onInviteUser={() => setInviteModalOpen(true)}
            messages={chatMode === 'dm' ? (dmMessages as any) : (roomMessages as any)}
            onSendMessage={chatMode === 'dm' ? sendDmMessage : sendRoomMessage}
            onTyping={chatMode === 'dm' ? sendDmTyping : sendRoomTyping}
            isTyping={chatMode === 'dm' ? isDmTyping : false}
            groupTypingUsers={chatMode === 'group' ? roomTypingUsers : []}
            onReact={chatMode === 'dm' ? sendDmReact : sendRoomReact}
            notifications={notifications}
            onAcceptFriend={handleAcceptFriend}
            onDeclineFriend={handleDeclineFriend}
            onAcceptInvite={handleAcceptInvite}
            onDeclineInvite={handleDeclineInvite}
            roomId={mode === 'group' ? (activeGroupId ?? undefined) : undefined}
            isOwner={isCurrentRoomOwner}
            onLeaveOrDeleteSuccess={() => {
              setActiveGroupId(null);
              setMode('dm');
              setDmTab('friends');
            }}
          >
            {}
            {mode === 'group' && (
              <MemberPanel 
                isOpen={membersOpen} 
                onClose={() => setMembersOpen(false)} 
                members={enrichedRoomMembers} 
                roomName={activeGroup?.name ?? ''} 
                currentUser={currentUser}
                onSelectMember={handleSelectDm}
              />
            )}
            {}
            {mode === 'dm' && (
              <TerminalPanel isOpen={terminalOpen} />
            )}
          </ChatArea>

        ) : mode === 'dm' && (dmTab === 'friends' || dmTab === 'pending') ? (
          
          <div className="chat-area">
            <ChatTopbar
              mode="empty"
              title={dmTab === 'friends' ? 'FRIENDS' : 'PENDING REQUESTS'}
              membersOpen={membersOpen}
              onToggleMembers={() => setMembersOpen(v => !v)}
              terminalOpen={terminalOpen}                            
              onToggleTerminal={() => setTerminalOpen(v => !v)}      
              notifications={notifications}
              onAcceptFriend={handleAcceptFriend}
              onDeclineFriend={handleDeclineFriend}
              onAcceptInvite={handleAcceptInvite}
              onDeclineInvite={handleDeclineInvite}
            />

            {}
            <div className="chat-content-row">
              <FriendsDashboard
                 tab={dmTab}
                 friends={friends.map(f => {
                   const isSender = f.sender_username === currentUser.username
                   const uname = isSender ? f.recipient_username : f.sender_username
                   const uname_display = (f as any).friend_name || (f as any).name || uname
                   return {
                     ...f,
                     username: uname,
                     name: uname_display,
                     avatar_color: (f as any).friend_avatar_color || (f as any).avatar_color || colorFromName(uname_display),
                     status: 'offline'
                   }
                 })}
                 pending={pending.map(f => {
                   const isIncoming = f.recipient_username === currentUser.username
                   const peerUsername = isIncoming ? f.sender_username : f.recipient_username
                   const resolvedName  = (f as any).friend_name ?? peerUsername
                   const resolvedColor = (f as any).friend_avatar_color ?? colorFromName(resolvedName)
                   return { ...f, _resolved_peer_name: resolvedName, _resolved_peer_color: resolvedColor }
                 })}
                 roomInvites={notifications
                   .filter((n: any) => n.type === 'group_invite')
                   .map((n: any) => ({
                     id:                   n.id,
                     from_username:        n.from_username,
                     room_name:            n.room_name ?? 'A SERVER',
                     _resolved_peer_name:  n.from_username,
                     _resolved_peer_color: colorFromName(n.from_username),
                   }))
                 }
                 sentRoomInvites={sentRoomInvites}      
                 currentUsername={currentUser.username}
                 onChat={handleSelectDm}
                 onRemove={handleRemoveFriend}
                 onAccept={handleAcceptFriend}
                 onDecline={handleDeclineFriend}
                 onCancel={handleCancelRequest}
                 onAcceptInvite={handleAcceptInvite}
                 onDeclineInvite={handleDeclineInvite}
                 onCancelRoomInvite={cancelRoomInvite}  
              />

              <TerminalPanel isOpen={terminalOpen} />
            </div>
          </div>
        ) : (
          <ChatArea
            mode="empty"
            title=""
            subtitle=""
            membersOpen={membersOpen}
            onToggleMembers={() => setMembersOpen(v => !v)}
            terminalOpen={terminalOpen}                            
            onToggleTerminal={() => setTerminalOpen(v => !v)}      
            notifications={notifications}
            onAcceptFriend={handleAcceptFriend}
            onDeclineFriend={handleDeclineFriend}
            onAcceptInvite={handleAcceptInvite}
            onDeclineInvite={handleDeclineInvite}
          >
            <TerminalPanel isOpen={terminalOpen} />
          </ChatArea>
        )}
      </div>

      <ProfileBar
        user={currentUser}
        myStatus={myStatus}
        onStatusChange={setMyStatus}
        onUserPanelOpen={() => setUserPanelOpen(true)}
        onSettingsOpen={() => navigate('/settings')}
      />

      <UserPanel
        isOpen={userPanelOpen}
        onClose={() => setUserPanelOpen(false)}
      />

      <GroupModal
        isOpen={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreated={handleGroupCreated}
        onCreateGroup={handleCreateGroup}
        onSearchGroups={handleSearchGroups}
        onJoinGroup={handleJoinGroup}
        onRequestJoin={handleRequestJoin}
      />

      <AddFriendModal
        isOpen={addFriendOpen}
        onClose={() => setAddFriendOpen(false)}
        onSearch={searchUsers}
        onSendRequest={addFriend}
        currentUsername={currentUser.username}
        friends={friends}
        pending={pending}
        onGoToPending={() => {
          setAddFriendOpen(false)
          setDmTab('pending')
          setActiveDmUser(null)
          setMode('dm')
          setActiveGroupId(null)
        }}
      />

      <InviteUserModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        groupName={activeGroup?.name ?? 'Group'}
        groupId={activeGroupId ?? ''}
        currentUsername={currentUser.username}
        onSearch={async (q) => {
          const users = await searchUsers(q)
          return users.map(u => {
            const hasPending = sentRoomInvites.some(
              si => si.room_id === activeGroupId && si.recipient_username === u.username && si.status === 'pending'
            )
            const isMember = activeRoomData?.owner_username === u.username

            return {
              username:           u.username,
              name:               u.name,
              avatar_color:       u.avatar_color,
              is_member:          !!isMember,
              has_pending_invite: hasPending,
            }
          })
        }}
        onFetchMembers={async (gId) => {
          try { return await listRoomMembers(gId) } catch { return [] }
        }}
        onInvite={async (username, gId) => {
          const result = await inviteUserToRoom(username, gId)
          if (result === true) await fetchSentRoomInvites()
          return result
        }}
        onGoToPending={() => {
          setInviteModalOpen(false)
          setDmTab('pending')
          setActiveDmUser(null)
          setMode('dm')
          setActiveGroupId(null)
        }}
      />

    </div>
  )
}