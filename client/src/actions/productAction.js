import axios from 'axios';
import { proxyurl } from '../constants/proxyUrl';

const getAllProduct = async () => {
    try {
        const response = await axios.get(`${proxyurl}/products`);
        const products = await response.data.data;
        console.log(products)
        
        return products; 

    } catch (error) {
        console.error('Error fetching products:', error);

    }
};

export { getAllProduct };
