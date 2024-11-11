import Image from 'next/image';

interface ProfileAvatarProps {
  profilePicture?: string | null;
  profileColor?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24'
};

export function ProfileAvatar({ profilePicture, profileColor, name, size = 'md' }: ProfileAvatarProps) {
  const initial = (name || 'U').charAt(0).toUpperCase();
  const sizeClass = sizes[size];

  if (profilePicture) {
    return (
      <div className={`relative ${sizeClass} rounded-full overflow-hidden`}>
        <Image
          src={profilePicture}
          alt={`${name}'s profile`}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-semibold`}
      style={{ 
        background: profileColor || 'linear-gradient(135deg, #6366f1, #a855f7)'
      }}
    >
      {initial}
    </div>
  );
} 