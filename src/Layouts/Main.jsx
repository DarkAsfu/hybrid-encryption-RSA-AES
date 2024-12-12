import { Outlet } from "react-router-dom";

const Main = () => {
    return (
        <div>
            This is nav
            <Outlet/>
            This is footer
        </div>
    );
};

export default Main;