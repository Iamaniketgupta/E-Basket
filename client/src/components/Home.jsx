import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./common/ProductCard";
import { useEffect } from "react";
import { getAllProduct } from "../actions/productAction";
import { fetchProductSuccess, makeError, makeRequest } from "../reducers/productSlice";

const Home = () => {
    const dispatch = useDispatch();
    useEffect(() => {

        const fetchProducts = async () => {
            try {
                dispatch(makeError(null));
                dispatch(makeRequest(true));
                const products = await getAllProduct();
                dispatch(fetchProductSuccess(products));
                dispatch(makeRequest(false));

            } catch (error) {
                console.error('Error fetching products:', error);
                dispatch(makeError("Something went wrong"));
            }
        };
        fetchProducts();
    }, [dispatch]);

    const { products, loading,error } = useSelector((state) => state.product) || [];
console.log(products,loading,error)


    return (
        <div className='relative inset-0 bg-pink-300'>
            {/* Hero Section */}
            <section className="h-full bg-contain relative">
                <div className="bg-black opacity-15 inset-0 absolute"></div>


            </section>

            {/* category section */}

            <section>

            </section>


            {/* Products Section */}

            <section className='bg-yellow-300 my-3'>
                <h1 className="text-center my-3">Products</h1>
                {loading ? "Loading..." :  
                error?error:
                <div className="p-3 grid gap-3 grid-cols-4 bg-slate-300">
                {products&& products?.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>}
            </section>


{/* Clients Reviews */}

               <section>
                </section>     










        </div>


    );
}

export default Home;
