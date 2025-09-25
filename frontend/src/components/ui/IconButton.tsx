import { FC, MouseEventHandler } from 'react';

interface Props {
  icon: string; // emoji or svg
  label?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
export const IconButton: FC<Props> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-sm hover:opacity-80"
  >
    <span className="text-xl">{icon}</span>
    {label && <span>{label}</span>}
  </button>
);