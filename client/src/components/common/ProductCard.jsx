import { Link } from "react-router-dom";

const ProductCard = (props) => {
    const product = props?.product;
    return (
        <Link to={"#"} className="max-w-[300px] sm:w-[150px] max-h-[500px] sm:h-[200px] bg-white">
                <div className="h-[50%] bg-contain">
                    <img src="" alt="" />
                </div>
                <div>
                    {product?.title}
                </div>
                <div>
                {product?.price}

                </div>
                <div>
                {product?.rating}

                </div>
                <div>
                {product?.Stock}

                </div>
        </Link>
    );
}

export default ProductCard;
