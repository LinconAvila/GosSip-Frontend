import '../styles/chat_area.css'
import logo from '../assets/logo.png'

export function LogoIcon() {
  return (
    <img src={logo} alt="Gossip" />
  )
}

export function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m22,20v-1h-1v-1h-1v-1h-1v-1h-2v-1h1v-2h1v-6h-1v-2h-1v-1h-1v-1h-1v-1h-2v-1h-6v1h-2v1h-1v1h-1v1h-1v2h-1v6h1v2h1v1h1v1h1v1h2v1h6v-1h2v-1h1v2h1v1h1v1h1v1h1v1h2v-1h1v-2h-1Zm-10-5v1h-4v-1h-2v-1h-1v-2h-1v-4h1v-2h1v-1h2v-1h4v1h2v1h1v2h1v4h-1v2h-1v1h-2Z" fill="white"/>
    </svg>
  )
}

export function SearchIcon2() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m22,20v-1h-1v-1h-1v-1h-1v-1h-2v-1h1v-2h1v-6h-1v-2h-1v-1h-1v-1h-1v-1h-2v-1h-6v1h-2v1h-1v1h-1v1h-1v2h-1v6h1v2h1v1h1v1h1v1h2v1h6v-1h2v-1h1v2h1v1h1v1h1v1h1v1h2v-1h1v-2h-1Zm-10-5v1h-4v-1h-2v-1h-1v-2h-1v-4h1v-2h1v-1h2v-1h4v1h2v1h1v2h1v4h-1v2h-1v1h-2Z" fill="currentColor"/>
    </svg>
  );
}
export function FriendsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
      <title>Users</title>
      <g fill="currentColor">
        <polygon points="2 13 2 12 1 12 1 10 2 10 2 9 7 9 7 12 8 12 8 13 2 13" />
        <polygon points="5 7 4 7 4 5 5 5 5 4 7 4 7 5 8 5 8 6 7 6 7 8 5 8 5 7" />
        <polygon points="8 7 9 7 9 6 10 6 10 5 14 5 14 6 15 6 15 7 16 7 16 11 15 11 15 12 14 12 14 13 10 13 10 12 9 12 9 11 8 11 8 7" />
        <polygon points="19 18 20 18 20 21 19 21 19 22 5 22 5 21 4 21 4 18 5 18 5 17 6 17 6 16 8 16 8 15 16 15 16 16 18 16 18 17 19 17 19 18" />
        <polygon points="23 10 23 12 22 12 22 13 16 13 16 12 17 12 17 9 22 9 22 10 23 10" />
        <polygon points="17 6 16 6 16 5 17 5 17 4 19 4 19 5 20 5 20 7 19 7 19 8 17 8 17 6" />
      </g>
    </svg>
  )
}

export function AddFriendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
      <title>Add Friend</title>
      <g fill="currentColor">
        <polygon points="11 20 12 20 12 21 2 21 2 20 1 20 1 17 2 17 2 16 3 16 3 15 4 15 4 14 11 14 11 15 10 15 10 18 11 18 11 20" />
        <polygon points="13 5 13 10 12 10 12 11 11 11 11 12 6 12 6 11 5 11 5 10 4 10 4 5 5 5 5 4 6 4 6 3 11 3 11 4 12 4 12 5 13 5" />
        <path d="M22,15V13H21V12H19V11H16v1H14v1H13v2H12v3h1v2h1v1h2v1h3V21h2V20h1V18h1V15Zm-4,4H17V17H15V16h2V14h1v2h2v1H18Z" />
      </g>
    </svg>
  );
}

export function PendingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24px" height="24px">
      <title>Pending</title>
      <g fill="currentColor" strokeWidth="1">
        <path d="m19.81 26.67 0 1.52 3.04 0 0 1.53 -13.71 0 0 -1.53 3.05 0 0 -1.52 -3.05 0 0 -3.05 -1.52 0 0 6.1 -3.05 0 0 1.52 22.86 0 0 -1.52 -3.05 0 0 -6.1 -1.53 0 0 3.05 -3.04 0z" />
        <path d="M21.33 20.57h1.52v3.05h-1.52Z" />
        <path d="M21.33 8.38h1.52v3.05h-1.52Z" />
        <path d="M19.81 19.05h1.52v1.52h-1.52Z" />
        <path d="M18.28 17.53h1.53v1.52h-1.53Z" />
        <path d="M16.76 25.14h3.05v1.53h-3.05Z" />
        <path d="m19.81 14.48 0 -1.53 1.52 0 0 -1.52 -10.67 0 0 1.52 1.53 0 0 1.53 1.52 0 0 3.05 1.53 0 0 7.61 1.52 0 0 -7.61 1.52 0 0 -3.05 1.53 0z" />
        <path d="M12.19 25.14h3.05v1.53h-3.05Z" />
        <path d="M12.19 17.53h1.52v1.52h-1.52Z" />
        <path d="M10.66 19.05h1.53v1.52h-1.53Z" />
        <path d="M9.14 20.57h1.52v3.05H9.14Z" />
        <path d="M9.14 8.38h1.52v3.05H9.14Z" />
        <path d="m9.14 2.29 13.71 0 0 6.09 1.53 0 0 -6.09 3.05 0 0 -1.53 -22.86 0 0 1.53 3.05 0 0 6.09 1.52 0 0 -6.09z" />
      </g>
    </svg>
  )
}


export function NotificationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
      <title>Notifications</title>
      <g fill="currentColor">
        <path d="M15 20V22H14V23H10V22H9V20H15Z" />
        <path d="M22 17V18H21V19H3V18H2V17H3V16H4V14H5V8H6V6H7V5H8V4H10V3H11V1H13V3H14V4H16V5H17V6H18V8H19V14H20V16H21V17H22Z" />
      </g>
    </svg>
  )
}

export function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
      <title>Settings</title>
      <g fill="currentColor">
        <path d="M21 10V9H20V7H21V5H20V4H19V3H17V4H15V3H14V1H10V3H9V4H7V3H5V4H4V5H3V7H4V9H3V10H1V14H3V15H4V17H3V19H4V20H5V21H7V20H9V21H10V23H14V21H15V20H17V21H19V20H20V19H21V17H20V15H21V14H23V10H21ZM10 10V9H14V10H15V14H14V15H10V14H9V10H10Z" fill="white"/>
      </g>
    </svg>
  );
}

<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 10V9H20V7H21V5H20V4H19V3H17V4H15V3H14V1H10V3H9V4H7V3H5V4H4V5H3V7H4V9H3V10H1V14H3V15H4V17H3V19H4V20H5V21H7V20H9V21H10V23H14V21H15V20H17V21H19V20H20V19H21V17H20V15H21V14H23V10H21ZM10 10V9H14V10H15V14H14V15H10V14H9V10H10Z" fill="white"/>
</svg>

export function MembersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
      <title>Members</title>
      <g fill="currentColor">
        <path d="M16 20H15V21H2V20H1V17H2V16H3V15H4V14H13V15H14V16H15V17H16V20Z" />
        <path d="M13 12V11H14V5H18V6H19V11H18V12H13Z" />
        <path d="M23 17V20H22V21H16V20H17V16H16V15H15V14H20V15H21V16H22V17H23Z" />
        <path d="M12 3V4H11V5H10V4H9V3H8V4H7V5H6V4H5V3H4V10H5V11H6V12H11V11H12V10H13V3H12ZM11 9H10V10H7V9H6V7H11V9Z" />
      </g>
    </svg>
  )
}

export function ServerOwnerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" height="20px">
      <title>Server Owner</title>
      <g fill="var(--yellow)">
        <path d="M23 7V9H22V10H21V14H20V17H19V19H18V21H6V19H5V17H4V14H3V10H2V9H1V7H2V6H4V7H5V9H4V10H5V11H6V12H8V11H9V9H10V7H11V6H10V4H11V3H13V4H14V6H13V7H14V9H15V11H16V12H18V11H19V10H20V9H19V7H20V6H22V7H23Z" />
      </g>
    </svg>
  )
}

export function DMIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
      <title>Direct Messages</title>
      <g fill="currentColor">
        <path d="M21 4V5H20V6H19V7H18V8H17V9H16V10H15V11H14V12H13V13H11V12H10V11H9V10H8V9H7V8H6V7H5V6H4V5H3V4H21Z" />
        <path d="M23 5V19H22V20H2V19H1V5H3V6H4V7H5V8H6V9H7V10H8V11H9V12H10V13H11V14H13V13H14V12H15V11H16V10H17V9H18V8H19V7H20V6H21V5H23Z" />
      </g>
    </svg>
  )
}
export function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
      <title>Logout</title>
      <g fill="currentColor">
        <path d="M14 5V4H16V5H17V6H18V7H19V8H20V9H21V10H22V11H23V13H22V14H21V15H20V16H19V17H18V18H17V19H16V20H14V19H13V17H14V16H15V15H16V14H7V10H16V9H15V8H14V7H13V5H14Z" fill="white"/>
        <path d="M4 2H1V22H4V2Z" fill="white"/>
      </g>
    </svg>
  );
}


export function EditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 4V7H21V8H20V7H19V6H18V5H17V4H18V3H21V4H22Z" fill="#F4F4F4"/>
  <path d="M17 14H18V21H17V22H2V21H1V6H2V5H14V6H13V7H3V20H16V15H17V14Z" fill="#F4F4F4"/>
  <path d="M18 8H19V10H18V11H17V12H16V13H15V14H14V15H13V16H12V17H11V18H7V14H8V13H9V12H10V11H11V10H12V9H13V8H14V7H15V6H17V7H18V8Z" fill="#F4F4F4"/>
</svg>
  );
}


export function SendIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width="40px" 
      height="40px"
    >
      <title>Send</title>
      <g fill="var(--text-main)">
        <path d="M4 3 h4 v1 h2 v1 h2 v1 h2 v1 h2 v1 h2 v1 h2 v1 h2 v2 
                 h-2 v1 h-2 v1 h-2 v1 h-2 v1 h-2 v1 h-2 v1 h-2 v1 h-4 
                 v-2 h1 v-2 h1 v-1 h1 v-1 h1 v-1 h2 
                 v-4 
                 h-2 v-1 h-1 v-1 h-1 v-1 h-1 v-2 h-1 v-2 Z 
                 M10 11 v2 h6 v-2 h-6 Z" />
      </g>
    </svg>
  );
}

export function MentionIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width="20px" 
      height="20px"
    >
      <title>Mentions</title>
      <g fill="currentColor"> 
          <path d="M22 10V8H21V6H20V4H19V3H17V2H14V1H10V2H7V3H5V4H4V5H3V7H2V9H1V15H2V17H3V19H4V20H5V21H7V22H10V23H14V22H17V19H14V20H10V19H7V18H6V16H5V14H4V10H5V8H6V6H7V5H10V4H14V5H17V6H18V8H19V10H20V14H18V10H17V8H16V7H14V6H10V7H8V8H7V10H6V14H7V16H8V17H10V18H14V17H16V16H17V17H21V16H22V14H23V10H22ZM15 14H14V15H10V14H9V10H10V9H14V10H15V14Z" fill="currentColor"/>
      </g>
    </svg>
  );
}

export function MailboxIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 32 32" 
      height="32px" 
      width="32px"
    >
      <title>Empty Mailbox</title>
      <g fill="currentColor">
        <path d="M28.185 9.14h1.53v12.19h-1.53Z" />
        <path d="M26.665 7.62h1.52v1.52h-1.52Z" />
        <path d="M3.805 22.86h9.14V32h1.53v-9.14h4.57V32h1.52v-9.14h7.62v-1.53h-13.71V9.14h-1.53V7.62h6.1v4.57h1.52V7.62h6.1V6.09h-6.1V4.57h4.57V0h-6.09v6.09H5.325v1.53h-1.52v1.52h-1.52v12.19h1.52Zm16.76 -21.34h3.05v1.53h-3.05Zm-16.76 9.14h1.52V9.14h3.05v1.52h-3.05v7.62h-1.52Z" />
      </g>
    </svg>
  );
}

export function ApproveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 2V1H2V2H1V22H2V23H22V22H23V2H22ZM5 11H6V10H7V9H8V10H9V11H10V12H12V11H13V10H14V9H15V8H16V7H17V8H18V9H19V10H18V11H17V12H16V13H15V14H14V15H13V16H12V17H10V16H9V15H8V14H7V13H6V12H5V11Z" fill="white"/>
</svg>
  )
  
}

export function RefuseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 2V1H2V2H1V22H2V23H22V22H23V2H22ZM15 13V14H16V15H17V16H16V17H15V16H14V15H13V14H11V15H10V16H9V17H8V16H7V15H8V14H9V13H10V11H9V10H8V9H7V8H8V7H9V8H10V9H11V10H13V9H14V8H15V7H16V8H17V9H16V10H15V11H14V13H15Z" fill="white"/>
</svg>
  )
}

export function ApproveIcon2() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M23 5V6H22V7H21V8H20V9H19V10H18V11H17V12H16V13H15V14H14V15H13V16H12V17H11V18H10V19H8V18H7V17H6V16H5V15H4V14H3V13H2V12H1V11H2V10H3V9H4V10H5V11H6V12H7V13H8V14H10V13H11V12H12V11H13V10H14V9H15V8H16V7H17V6H18V5H19V4H20V3H21V4H22V5H23Z" fill="white"/>
</svg>
  )
  
}

export function RefuseIcon2() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 13H16V14H17V15H18V16H19V17H20V18H21V19H22V20H21V21H20V22H19V21H18V20H17V19H16V18H15V17H14V16H13V15H11V16H10V17H9V18H8V19H7V20H6V21H5V22H4V21H3V20H2V19H3V18H4V17H5V16H6V15H7V14H8V13H9V11H8V10H7V9H6V8H5V7H4V6H3V5H2V4H3V3H4V2H5V3H6V4H7V5H8V6H9V7H10V8H11V9H13V8H14V7H15V6H16V5H17V4H18V3H19V2H20V3H21V4H22V5H21V6H20V7H19V8H18V9H17V10H16V11H15V13Z" fill="white"/>
</svg>
  )
}

export function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 13H16V14H17V15H18V16H19V17H20V18H21V19H22V20H21V21H20V22H19V21H18V20H17V19H16V18H15V17H14V16H13V15H11V16H10V17H9V18H8V19H7V20H6V21H5V22H4V21H3V20H2V19H3V18H4V17H5V16H6V15H7V14H8V13H9V11H8V10H7V9H6V8H5V7H4V6H3V5H2V4H3V3H4V2H5V3H6V4H7V5H8V6H9V7H10V8H11V9H13V8H14V7H15V6H16V5H17V4H18V3H19V2H20V3H21V4H22V5H21V6H20V7H19V8H18V9H17V10H16V11H15V13Z" fill="#111111"/>
</svg>
  );
}



export function ReturnIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M192 96v64h248c4.4 0 8 3.6 8 8v240c0 4.4-3.6 8-8 8H136c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h248V224H192v64L64 192l128-96z" fill="#111111"/>
    </svg>
  )
}

export function ReturnLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 13V11H2V10H3V9H4V8H5V7H6V6H7V5H8V4H9V3H10V2H11V1H12V2H13V3H14V4H13V5H12V6H11V7H10V8H9V9H8V10H23V14H8V15H9V16H10V17H11V18H12V19H13V20H14V21H13V22H12V23H11V22H10V21H9V20H8V19H7V18H6V17H5V16H4V15H3V14H2V13H1Z" fill="white"/>
</svg>
  );
}

export function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 11V13H21V14H20V15H18V16H16V17H15V18H13V19H11V20H10V21H8V22H6V23H3V22H2V2H3V1H6V2H8V3H10V4H11V5H13V6H15V7H16V8H18V9H20V10H21V11H22Z" fill="#121212"/>
</svg>
  );
}

export function EllipsisIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 11H15V13H14V14H13V15H11V14H10V13H9V11H10V10H11V9H13V10H14V11Z" fill="white"/>
  <path d="M6 11H7V13H6V14H5V15H3V14H2V13H1V11H2V10H3V9H5V10H6V11Z" fill="white"/>
  <path d="M23 11V13H22V14H21V15H19V14H18V13H17V11H18V10H19V9H21V10H22V11H23Z" fill="white"/>
</svg>
  );
}


export function LockedPadlockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12V11H19V6H18V4H17V3H16V2H14V1H10V2H8V3H7V4H6V6H5V11H4V12H3V22H4V23H20V22H21V12H20ZM8 6H9V5H10V4H14V5H15V6H16V11H8V6Z" fill="currentColor"/>
    </svg>
  );
}

export function UnlockedPadlockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 6V11H20V6H19V5H15V6H14V11H17V12H18V21H17V22H2V21H1V12H2V11H11V6H12V4H13V3H15V2H19V3H21V4H22V6H23Z" fill="currentColor"/>
    </svg>
  );
}

export function SpeechBubbleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M23 8V14H22V16H21V17H20V18H18V19H15V20H9V19H7V20H6V21H1V19H2V18H3V16H2V14H1V8H2V6H3V5H4V4H6V3H9V2H15V3H18V4H20V5H21V6H22V8H23Z" fill="white"/>
</svg>
  );
}

export function OptionsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 3V5H14V6H13V7H11V6H10V5H9V3H10V2H11V1H13V2H14V3H15Z" fill="white"/>
  <path d="M14 11H15V13H14V14H13V15H11V14H10V13H9V11H10V10H11V9H13V10H14V11Z" fill="white"/>
  <path d="M14 19H15V21H14V22H13V23H11V22H10V21H9V19H10V18H11V17H13V18H14V19Z" fill="white"/>
</svg>
  );
}

export function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 1H9V2H10V1Z" fill="white"/>
  <path d="M9 2V3H8V5H7V8H2V7H3V5H4V4H5V3H7V2H9Z" fill="white"/>
  <path d="M13 2H14V4H15V6H16V8H8V6H9V4H10V2H11V1H13V2Z" fill="white"/>
  <path d="M15 1H14V2H15V1Z" fill="white"/>
  <path d="M22 7V8H17V5H16V3H15V2H17V3H19V4H20V5H21V7H22Z" fill="white"/>
  <path d="M17 10V14H16V15H8V14H7V10H8V9H16V10H17Z" fill="white"/>
  <path d="M1 9H7V10H6V14H7V15H1V9Z" fill="white"/>
  <path d="M23 9V15H17V14H18V10H17V9H23Z" fill="white"/>
  <path d="M22 16V17H21V19H20V20H19V21H17V22H15V21H16V19H17V16H22Z" fill="white"/>
  <path d="M10 22H9V23H10V22Z" fill="white"/>
  <path d="M9 21V22H7V21H5V20H4V19H3V17H2V16H7V19H8V21H9Z" fill="white"/>
  <path d="M15 22H14V23H15V22Z" fill="white"/>
  <path d="M14 22H13V23H11V22H10V20H9V18H8V16H16V18H15V20H14V22Z" fill="white"/>
</svg>
  );
}

export function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 9H6V5H7V3H8V2H10V1H14V2H16V3H17V5H18V9H17V11H16V12H14V13H10V12H8V11H7V9Z" fill="white"/>
  <path d="M22 19V22H21V23H3V22H2V19H3V18H4V17H5V16H7V15H17V16H19V17H20V18H21V19H22Z" fill="white"/>
</svg>
  );
}

export function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px">
      <title>Home</title>
      <g fill="currentColor">
        {/* Cole o(s) path(s) de home aqui */}
      </g>
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M23 11V13H22V14H14V22H13V23H11V22H10V14H2V13H1V11H2V10H10V2H11V1H13V2H14V10H22V11H23Z" fill="white"/>
</svg>
  );
}

export function CompassIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px">
      <title>Explore</title>
      <g fill="currentColor">
        {/* Cole o(s) path(s) da bússola aqui */}
      </g>
    </svg>
  );
}



export function EmojiIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px">
      <title>Emoji</title>
      <g fill="currentColor">
        {/* Cole o(s) path(s) de emoji aqui */}
      </g>
    </svg>
  );
}

export function AttachmentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px">
      <title>Attach</title>
      <g fill="currentColor">
        {/* Cole o(s) path(s) de anexo aqui */}
      </g>
    </svg>
  );
}

export function InviteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px">
      <title>Invite</title>
      <g fill="currentColor">
        {/* Cole o(s) path(s) de convite (envelope) aqui */}
      </g>
    </svg>
  );
}

export function BombIcon() {
  return (
    <svg fill="#ffffff" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 503.607 503.607" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(1 1)"> <g> <path d="M385.098,115.669L368.311,14.948c-0.839-2.518-1.679-5.036-4.197-5.875c-2.518-1.679-5.036-1.679-7.554-0.839 l-80.577,29.301V7.393c0-5.036-3.357-8.393-8.393-8.393h-33.574c-5.036,0-8.393,3.357-8.393,8.393v30.445L144.207,8.233 c-1.679-0.839-4.197-0.839-6.715,0.839c-2.518,1.679-4.197,3.357-4.197,5.875l-16.787,100.721 c-0.839,3.357,0.839,6.715,3.357,8.393l60.648,43.758c-4.134,9.428-7.863,19.033-11.183,28.781 c-0.215,0.479-0.388,0.99-0.515,1.53c-3.397,10.122-6.356,20.395-8.848,30.79c-0.955,1.366-1.492,3.095-1.492,5.096 c0,0.385,0.026,0.757,0.065,1.123c-5.562,25.153-8.458,50.956-8.458,76.936v73.023v14.269v2.518 c0,52.09,38.889,94.092,88.649,100.003c0.385,0.047,0.771,0.088,1.157,0.131c0.295,0.032,0.59,0.065,0.886,0.095 c2.754,0.279,5.538,0.45,8.351,0.493c0,0,0.839,0,1.679,0c14.531,0,28.322-2.954,40.847-8.584 c35.193-15.548,59.874-50.641,59.874-92.137v-89.81c0-49.399-10.641-98.794-30.505-144.201l60.722-43.812 C384.259,122.384,385.938,119.026,385.098,115.669z M242.41,15.787h16.787v30.198c-0.533,1.057-0.839,2.215-0.839,3.376v46.164 c0,1.094,0.359,2.188,0.839,3.282v68.062c0,5.036-3.357,8.393-8.393,8.393s-8.393-3.357-8.393-8.393V94.685V49.361V15.787z M134.134,113.151l14.269-85.613l77.22,27.698V91.83c-14.657,18.931-27.368,39.264-37.954,60.636L134.134,113.151z M334.738,401.885c0,1.42-0.037,2.831-0.108,4.234c-1.074,21.035-10.123,40.41-25.072,55.36 c-15.741,15.741-37.207,24.106-59.553,24.321c-1.022-0.01-2.042-0.031-3.056-0.078c-0.243-0.011-0.486-0.02-0.728-0.033 c-1.076-0.059-2.144-0.147-3.209-0.246c-0.442-0.043-0.886-0.081-1.327-0.131c-0.705-0.077-1.404-0.175-2.104-0.269 c-0.956-0.134-1.913-0.267-2.859-0.436c-0.068-0.012-0.135-0.025-0.203-0.036c-39.371-7.119-69.65-43.483-69.65-86.042v-1.679 c54.557,17.626,113.312,17.626,167.869,0V401.885z M334.738,379.593c-53.977,19.253-113.832,19.356-167.869,0.302v-67.82 c0-23.46,2.501-46.819,7.325-69.666h26.248c5.036,0,8.393-3.357,8.393-8.393s-3.357-8.393-8.393-8.393H178.19 c1.489-5.637,3.124-11.233,4.895-16.787h34.145c5.036,0,8.393-3.357,8.393-8.393s-3.357-8.393-8.393-8.393h-28.317 c2.842-7.554,5.941-15.011,9.301-22.351c0.219-0.362,0.414-0.74,0.55-1.15c0.279-0.623,0.57-1.243,0.854-1.865 c7.485-15.945,16.17-31.334,26.005-45.978v46.164c0,14.269,10.911,25.18,25.18,25.18c14.269,0,25.18-10.911,25.18-25.18v-44.114 c9.994,14.966,18.755,30.425,26.02,46.632c0.704,0.704,1.412,1.404,2.177,2.046c19.858,44.012,30.557,92.112,30.557,140.643 V379.593z M313.876,152.511c-10.574-21.41-23.263-41.78-37.892-60.68V55.236l77.22-27.698l14.269,85.613L313.876,152.511z"></path> </g> </g> </g></svg>
  );
}