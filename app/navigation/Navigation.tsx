import Login from './components/Login'
import '../globals/navbar.css'
import Search from './components/Search'
import { updateImagesForCityActivities } from '../services/activitiesService'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useCallback } from 'react'
import { setSearchRehydrate } from '../store/slices/searchSlice'
import AutorenewIcon from '@mui/icons-material/Autorenew'

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
      <div className="nav-search">
        <Search />
      </div>

      <div className="nav-right">
        <button
          className="btn-secondary"
          disabled={!searchValue}
          aria-label="Update images"
          title="Update images"
          onClick={async () => await handleUpdateActivityImages()}
        >
          <AutorenewIcon sx={{ fontSize: 18 }} />
          <span className="btn-label">Update images</span>
        </button>
        <Login />
      </div>
    </nav>
  )
}
export default Navigation
