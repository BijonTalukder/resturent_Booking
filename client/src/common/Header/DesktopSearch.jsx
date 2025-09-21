import { Button } from "antd";
import { IoSearch } from "react-icons/io5";

 const DesktopSearch = ({ recentSearches, setSearchQuery, onSearch, setIsSearchOverlay }) => {
    return ( 
            <div className=" -top-10 left-0 w-full h-full  z-50 hidden md:block">
      <div className="max-w-[500px] bg-white rounded-md p-5 mx-auto">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100"
                  onClick={() => {
                    setSearchQuery(search);
                    onSearch(search);
                    setIsSearchOverlay(false);
                  }}
                >
                  <IoSearch className="text-gray-400 mr-3" />
                  <span className="text-gray-700">{search}</span>
                  
                </div>
                
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsSearchOverlay(false)}
            className="mt-4"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
    )
 };

export default DesktopSearch;