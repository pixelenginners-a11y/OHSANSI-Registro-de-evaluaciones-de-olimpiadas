import {
  BookOpen,
  Upload,
  Trophy,
  Layers,
  UserCog,
  UserCheck,
  Users,
  LogOut,
  Menu,
  X
} from "lucide-react";

export const icons = {
  'upload': Upload,
  'trophy': Trophy,
  'layers': Layers,
  'userCog': UserCog,
  'userCheck': UserCheck,
  'users': Users,
  'logOut': LogOut,
  'menu': Menu,
  'x': X,
  'book-open': BookOpen,
} as const;

export type IconName = keyof typeof icons;