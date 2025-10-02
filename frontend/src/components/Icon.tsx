import { icons, type IconName } from '../lib/Icons';

type IconProps = {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className = "w-5 h-5" }: IconProps) => {
  const IconComponent = icons[name];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export default Icon;