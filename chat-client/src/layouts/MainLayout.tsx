import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <header className="w-dvw py-2 bg-blue-800 text-center text-white  text-xl font-bold">
        실시간 채팅
      </header>
      <main className="w-dvw grow flex justify-center items-center">
        <Outlet />
      </main>
      <footer>임시 푸터</footer>
    </>
  );
};

export default MainLayout;
