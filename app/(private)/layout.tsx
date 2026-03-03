import Header from "@/components/common/header";

const PrivateLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PrivateLayout;
