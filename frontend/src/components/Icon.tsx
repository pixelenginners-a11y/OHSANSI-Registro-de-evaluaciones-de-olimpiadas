import { icons, type IconName } from '../lib/Icons';

type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
}

const Icon = ({ name, className, size = 16 }: IconProps) => {
  const IconComponent = icons[name];
  return IconComponent ? <IconComponent className={className} size={size} /> : null;
};

export default Icon;