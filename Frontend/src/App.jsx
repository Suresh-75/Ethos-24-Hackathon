import Users from "./components/Users";

function App() {
  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className=" h-[100vh] w-[100vw]  flex-col">
        <p className="text-center py-4 text-4xl font-bold text-purple-200">
          UnknownX
        </p>
        <div className=" grid grid-cols-4 h-[85vh] mx-10 gap-1">
          <div className="col-span-1   bg-[rgba(120,120,120,0.2)]  rounded-md ">
            <Users />
          </div>
          <div className="col-span-3  bg-[rgba(120,120,120,0.2)] rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
