import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <div className="h-dvh">
        <header className="w-dvw bg-blue-800 py-2 text-center text-xl font-bold text-white">
          실시간 채팅
        </header>
        <main className="h-[calc(100dvh-44px)] w-dvw overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <footer>임시 푸터</footer>
    </>
  );
};

export default MainLayout;
