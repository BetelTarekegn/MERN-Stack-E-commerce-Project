import { useGetProductsQuery } from "../redux/api/productApi";
import MetaData from "./layout/MetaData";
import ProductItem from "./product/productItem";
import Loader from "./layout/Loader";
import Filter from "./layout/Filter"
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast"
import CustomePagination from "./layout/CustomePagination";
import ChatbotHome from "./Chatbot/ChatbotHome"
import InfoSection from "../components/About/InfoSection";
import Layout from "../components/About/Layout";




function Home() {


    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const keyword = searchParams.get("keyword")?.trim() || "";
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const category = searchParams.get("category")
    const ratings = searchParams.get("ratings")

    const params = { page, keyword }
    min !== null && (params.min = min);
    max !== null && (params.max = max);
    category !== null && (params.category = category);
    ratings !== null && (params.ratings = ratings);

    console.log(params)
    console.log(min)
    console.log(max)


    const { data, isLoading, error, isError } = useGetProductsQuery(params);
    console.log(data);
    console.log(error);

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message)
        }
    }, [isError])
    // const columnSize = keyword ? 6 : 3;
    if (isLoading) return <Loader />

    return (

        <>
            <MetaData title={'Buy Best Products Online'} />


            <div className="row">
                {keyword && (
                    <div className="col-6 col-md-3 mt-5">
                        <Filter />
                    </div>
                )}
                <div className={keyword ? "col-12 col-sm-6 col-md-9" : "col-12 col-sm-6 col-md-12"}>
                    <h1 className="text-secondary">
                        {keyword.trim()
                            ? `${data?.products?.length} product${keyword} found with keyword: "${keyword}"`
                            : 'Latest Products'}
                    </h1>
                    <section id="products" className="mt-5">
                        <div className="row">
                            {data?.products?.slice(0, 8).map((product) => (
                                <ProductItem key={product._id} product={product} columnSize={3} />  // 3 = col-md-3 (12 / 4 = 4 per row)
                            ))}
                        </div>
                    </section>

                    <CustomePagination resPerPage={data?.resPerPage} filteredProductsCount={data?.filteredProductsCount} />
                    <ChatbotHome/>
                    <InfoSection/>
                    <Layout/>
                </div>
            </div>
        </>
    );
}
export default Home;