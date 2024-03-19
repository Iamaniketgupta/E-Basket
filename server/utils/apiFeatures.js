class ApiFeatures {
    constructor(MongoQuery, queryStrToSearch) {
        this.MongoQuery = MongoQuery;
        this.queryStrToSearch = queryStrToSearch;
    }

    async searchProducts() {
        const keyObj = this.queryStrToSearch.key ?
            {
                title: {
                    $regex: this.queryStrToSearch.key, //regular expression
                    $options: "i", //case in sensitive
                }
            } : {};

        this.MongoQuery = await this.MongoQuery.find({ ...keyObj });
        return this; // return Obj refrence

    }

    filterProducts() {
        const querCopy = { ...this.queryStrToSearch };
        const removeFeilds = ["key", "page", "limit"];

        removeFeilds.forEach((item) => delete querCopy[item]);

        // Filter for Price ans Rating
        let queryStrToSearch = JSON.stringify(querCopy);
        queryStrToSearch = queryStrToSearch.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);   // regular expression greaterthan greathanequal,lessthan lessthanequal

        this.MongoQuery = this.MongoQuery.find(querCopy);
        return this
    }

    Pagination(resultPerPage) {
        const currentPage = Number(this.queryStrToSearch.page) || 1;

        const skip = resultPerPage * (currentPage - 1);  // to skip the products

        this.MongoQuery = this.MongoQuery.limit(resultPerPage).skip(skip);
         
    }

}

export { ApiFeatures };