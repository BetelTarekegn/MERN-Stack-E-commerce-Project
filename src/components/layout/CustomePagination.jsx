import { useSearchParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomePagination({ resPerPage,  filteredProductsCount}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams]  = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const navigate=useNavigate();

    useEffect(
        () => {
            setCurrentPage(page);
        }, [page]
    )
     const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
        // You might also want to update the URL here

        if(searchParams.has("page")){
            searchParams.set("page",pageNumber)
        }
        else{
            searchParams.append("page",pageNumber)
        }
        const path=window.location.pathname +"?"+searchParams.toString();
        navigate(path)
    };
    console.log("filteredProductCount:",  filteredProductsCount, "resPerPage:", resPerPage);

    return (<div className="d-flex justify-content-center my-5">
        { filteredProductsCount > resPerPage &&(
            <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={ filteredProductsCount}
                onChange={setCurrentPageNo}
                nextPageText={"next"}
                prevPageText={"prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
            />
        )
            
        }
        
    </div>

    )
}
export default CustomePagination;