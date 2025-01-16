import { ReactElement } from 'react';

type SectionProps = {
  children?: ReactElement;
};

const Section = ({ children }: SectionProps): ReactElement => {
  return <div className="w-[540px] h-fit py-6 px-8 bg-white rounded-lg shadow-md text-zinc-600">{children}</div>;
};

export default Section;
