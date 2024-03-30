import {Link} from "react-router-dom"
const Header = () => {
    return (
        <header className="header bg-white overflow-hidden text-sm flex items-center gap-5 p-2 h-12">
            <div className="text-3xl font-bold text-indigo-600">
                <p>E-Basket</p>
            </div>
            <div className="grid grid-cols-3">
            <input type="search" name="q" placeholder="Search Anything"
                className="flex p-2 h-full border-2 col-span-2 border-indigo-600 rounded-2xl placeholder:pl-3 pl-5 outline-offset-1 outline-blue-500" />
            <nav className="grid grid-cols-4 place-content-center">
              <Link to={"/user/login"} className="ml-3">login</Link>
                <Link  to={"/user/signup"}>Signup</Link>
                <Link to={"/user/myorders"}>Cart</Link>
                <Link to={"/profile"}>My Profile</Link>
            </nav>
            </div>

        </header>
    );
}

export default Header;
