import { Sidebar } from 'primereact/sidebar'
import React from 'react'
import { Link } from 'react-router-dom'

const Adjustment = ({ visibleRight, setVisibleRight }) => {
  return (
    <div>
     <Sidebar
            visible={visibleRight}
            position="bottom"
            onHide={() => setVisibleRight(false)}
            className="w-[500px] rounded-t-2xl"
          >
     <p>Adjust your hotel seraching here</p>
      <Link to={``}>
               <div className="mt-6">
                 <button
             
                   className={`w-full bg-green-500 text-white py-2 rounded transition-all`}
                 >
                   Modify Search
                 </button>
               </div>
             </Link>
          </Sidebar>
    </div>
  )
}

export default Adjustment