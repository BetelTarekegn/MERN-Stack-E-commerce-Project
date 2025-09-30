import { Link } from "react-router-dom";
import { useState } from "react";
import StarRatings from "react-star-ratings"
function ProductItem({ product, columnSize }) {
    const [rating, setRating] = useState(product?.ratings || 0);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log("New rating:", newRating);
        // You could also send this to a server here if needed
    };
    console.log(product?.images?.[0]?.url)

    return (
        <div className={`col-sm-12 col-md-6 col-lg-${columnSize} my-3`} >
            <div className="card p-3 rounded">
                <img
                    className="card-img-top mx-auto"
                    src={product.images?.[0]?.url}
                    alt={product?.name || "Product"}
                    onError={(e) => (e.target.src = "/images/default_product.jpg")}
                />
                <div
                    className="card-body ps-3 d-flex justify-content-center flex-column"
                >
                    <h5 className="card-title">
                        <Link to={`/Product/${product?._id}`}>{product?.name}</Link>
                    </h5>
                    <div className="ratings mt-auto d-flex">
                        <StarRatings
                            rating={rating}
                            starRatedColor="#ffb829"
                            changeRating={handleRatingChange}
                            numberOfStars={5}
                            name='rating'
                            starDimension="22px"
                            starSpacing="1px"
                        />
                        <span id="no_of_reviews" className="pt-2 ps-2"> {product?.numOfReviews} </span>
                    </div>
                    <p className="card-text mt-2">${product?.price}</p>
                    <Link to={`/Product/${product?._id}`}>View Details</Link>


                </div>
            </div>
        </div >


    )
}
export default ProductItem;