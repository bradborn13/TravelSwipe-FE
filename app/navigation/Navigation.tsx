import Login from './components/Login'
import '../globals/navbar.css'
import Search from './components/Search'
import { updateImagesForCityActivities } from '../services/activitiesService'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useCallback } from 'react'
import { setSearchRehydrate } from '../store/slices/searchSlice'

function Navigation() {
  const searchValue = useAppSelector((state) => state.base.search)
  const dispatch = useAppDispatch()
  const handleUpdateActivityImages = useCallback(async () => {
    try {
      if (!searchValue) return
      await updateImagesForCityActivities({ city: searchValue })
      dispatch(setSearchRehydrate())
    } catch (err) {
      console.error('Error updating activity images:', err)
    }
  }, [searchValue])
  return (
    <nav>
      <div className="logo">
        travel<span>Swipe</span>
      </div>
      <Search />

      <div className="nav-right">
        <button className="btn-planner" onClick={async () => await handleUpdateActivityImages()}>
          Update Images
        </button>
        <Login />
      </div>
    </nav>
  )
}
export default Navigation
