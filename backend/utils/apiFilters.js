class APIFilter {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove unwanted fields
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach((el) => delete queryCopy[el]);

        // Iterate over the keys and replace the brackets for the operators like 'gte', 'lte', etc.
        for (const key in queryCopy) {
            if (key.includes('[') && key.includes(']')) {
                const operator = key.slice(key.indexOf('[') + 1, key.indexOf(']')); // Extract the operator like 'gte'
                const newKey = key.slice(0, key.indexOf('[')); // Extract the field name like 'price'

                // Construct the proper MongoDB query format
                queryCopy[newKey] = {
                    ...queryCopy[newKey],
                    [`$${operator}`]: queryCopy[key], // Use $ operator (e.g., $gte)
                };
                delete queryCopy[key]; // Remove the original query parameter
            }
        }

        // Now the queryCopy object should have MongoDB compatible syntax
        this.query = this.query.find(queryCopy);
        return this;
    }


    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

export default APIFilter