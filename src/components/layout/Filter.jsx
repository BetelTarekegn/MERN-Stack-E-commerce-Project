import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from '../../helpers/helper';
import { PRODUCT_CATEGORIES } from "../../constant/constant";
import { useEffect } from "react";
import StarRatings from "react-star-ratings";

function Filter() {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    searchParams.has("min") && setMin(searchParams.get("min"))
    searchParams.has("max") && setMax(searchParams.get("max"))

  }, []);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  //handle category and rating filters
  const handleClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name)
    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    })
    if (checkbox.checked === false) {
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name)
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
      }
    } else {
      //set new filters value if alerady there
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value)
      } else {
        searchParams.append(checkbox.name, checkbox.value)
      }
      const path = window.location.pathname + "?" + searchParams.toString();
      navigate(path);
    }
  }
  //filter by price
  let newParams = new URLSearchParams(searchParams); // clone current params
  const FilterHandler = (e) => {
    e.preventDefault()


    newParams = getPriceQueryParams(newParams, "min", min);
    newParams = getPriceQueryParams(newParams, "max", max);
    const path = window.location.pathname + "?" + newParams.toString();
    navigate(path)
  }
  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType)
    if (checkboxValue === value) return true;
    return false;
  }
  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form
        id="filter_form"
        className="px-2"
        onSubmit={FilterHandler}
      >
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min ($)"
              name="min"
              value={min}
              onChange={(e) => { setMin(e.target.value) }}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max ($)"
              name="max"
              value={max}
              onChange={(e) => { setMax(e.target.value) }}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary" >GO</button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Category</h5>

      {PRODUCT_CATEGORIES?.map((category) => <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          name="category"
          id="check4"
          value={category}
          defaultChecked={defaultCheckHandler("category", category)}
          onClick={(e) => handleClick(e.target)}
        />
        <label className="form-check-label" for="check4"> {" "} {category} </label>
      </div>)}

      <hr />
      <h5 className="mb-3">Ratings</h5>
      {[5, 4, 3, 2, 1].map((rating) => {
        return (
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="ratings"
              id="check7"
              value={rating}
              defaultChecked={defaultCheckHandler("rating", rating)}
              onClick={(e) => handleClick(e.target)}
            />
            <label className="form-check-label" for="check7">
              <StarRatings
                rating={rating}
                starRatedColor="#ffb829"
                numberOfStars={5}
                name='ratings'
                starDimension="20px"
                starSpacing="2px"
              />
            </label>
          </div>
        )



      })}

    </div>
  )
}
export default Filter;