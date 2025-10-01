import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../redux/api/productApi";
import StarRatings from "react-star-ratings";
import { useState, useEffect } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCartItems } from "../../redux/features/cartSlice";
import MetaData from "../layout/MetaData.jsx"

function ProductDetails() {
    const params = useParams();
    const [quantity, setQuantitiy] = useState(1);
    const { data, isLoading, error, isError } = useGetProductDetailsQuery(params?.id);
    const product = data?.product;
    const dispatch = useDispatch()

    const [rating, setRating] = useState(0);
    const [activeImage, setActiveImage] = useState("");

    // Set rating when product is available
    useEffect(() => {
        if (product?.ratings) {
            setRating(product.ratings);
        }
    }, [product]);

    // Set active image when product loads
    useEffect(() => {
        if (product?.images?.length > 0 && product.images?.[0]?.url) {
            setActiveImage(product.images[0].url);
        } else {
            setActiveImage("/images/default_product.jpg");
        }
    }, [product]);

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message);
        }
    }, [isError]);

    /**const increseQty = () => {
         const count = document.querySelector(".count");
         if (count.valueAsNumber >= 1) return;
         const qty = count.valueAsNumber + 1;
         setQuantitiy(qty)
     }
     const decreseQty = () => {
         const count = document.querySelector(".count");
         if (count.valueAsNumber <= 1) return;
         const qty = count.valueAsNumber - 1;
         setQuantitiy(qty)
     } */
    const increseQty = () => {
        setQuantitiy(prev => prev + 1);
    };

    const decreseQty = () => {
        setQuantitiy(prev => (prev > 1 ? prev - 1 : 1));
    };
    const setItemToCart = () => {
        const cartItem = {
            product: product?._id,
            name: product?.name,
            price: product?.price,
            image: product?.images[0]?.url,
            stock: product?.stock,
            quantity
        }
        dispatch(setCartItems(cartItem));
        toast.success("Item added to Cart")
    }

    if (isLoading) return <Loader />;

    return (
        <>
            <MetaData title={product?.name} />
            <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <div className="p-3">
                        <img
                            className="d-block w-80"
                            src={activeImage || "/images/default_product.jpg"}
                            alt={product?.name}
                            width="340"
                            height="390"
                        />
                    </div>
                    <div className="row justify-content-start mt-5">
                        {product?.images?.map((img, index) => (
                            <div key={index} className="col-2 ms-4 mt-2">
                                <a role="button" >
                                    <img
                                        className={`d-block border rounded p-3 cursor-pointer ${img.url === activeImage ? "border-warning" : ""
                                            }`}
                                        height="100"
                                        width="100"
                                        src={img.url}
                                        alt={product?.name}
                                        onClick={() => setActiveImage(img.url)}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product?.name}</h3>
                    <p id="product_id">Product #{product?._id}</p>

                    <hr />

                    <div className="d-flex">
                        <StarRatings
                            rating={rating}
                            starRatedColor="#ffb829"
                            changeRating={setRating}
                            numberOfStars={6}
                            name="rating"
                            starDimension="24px"
                            starSpacing="1px"
                        />
                        <span id="no-of-reviews" className="pt-1 ps-2">
                            ({product?.numOfReviews} Reviews)
                        </span>
                    </div>
                    <hr />

                    <p id="product_price">${product?.price}</p>
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreseQty}>-</span>
                        <input
                            type="number"
                            className="form-control count d-inline"
                            value={quantity}
                            readOnly
                        />
                        <span className="btn btn-primary plus" onClick={increseQty}>+</span>
                    </div>
                    <button
                        type="button"
                        id="cart_btn"
                        className="btn btn-primary d-inline ms-4"
                        disabled={product?.stock <= 0}
                        onClick={setItemToCart}
                    >
                        Add to Cart
                    </button>

                    <hr />

                    <p>
                        Status:{' '}
                        <span
                            id="stock_status"
                            className={product?.stock > 0 ? 'greenColor' : 'redColor'}
                        >
                            {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>

                    </p>

                    <hr />

                    <h4 className="mt-2">Description:</h4>
                    <p>{product?.description}</p>
                    <hr />
                    <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>

                    <div className="alert alert-danger my-5" type="alert">
                        Login to post your review.
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetails;