import { ReactElement } from "react";
import Section from "src/components/atoms/section";
import Header from "src/components/header";

const BasePage = (): ReactElement => {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="w-full h-full bg-gray-100">
        <Header />
        <div className="mt-[72px] pt-16 flex flex-col items-center overflow-auto">
          <Section />
        </div>
      </div>
    </div>
  );
};

export default BasePage;
