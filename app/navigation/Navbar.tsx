import Login from './Login'
import './Navbar.css'
import Search from './Search'
export default function Navbar() {
  return (
    <nav>
      <div className="logo">
        travel<span>Swipe</span>
      </div>
      <Search />

      <div className="nav-right">
        <button className="btn-planner">🗓 My Planner</button>
        <Login />
      </div>
    </nav>
  )
}
