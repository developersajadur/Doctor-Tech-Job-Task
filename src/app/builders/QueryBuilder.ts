import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.search as string;
    if (searchTerm) {
      const searchConditions = searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
      this.modelQuery = this.modelQuery.find({
        $or: searchConditions,
      } as FilterQuery<T>);
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.query };
    const excludeFields = ['search', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((field) => delete queryCopy[field]);

    // Price filtering
    if ('minPrice' in queryCopy || 'maxPrice' in queryCopy) {
      const priceQuery: Record<string, number> = {};

      if (queryCopy.minPrice) {
        priceQuery.$gte = Number(queryCopy.minPrice);
        delete queryCopy.minPrice;
      }

      if (queryCopy.maxPrice) {
        priceQuery.$lte = Number(queryCopy.maxPrice);
        delete queryCopy.maxPrice;
      }

      queryCopy['price'] = priceQuery;
    }

    this.modelQuery = this.modelQuery.find(queryCopy as FilterQuery<T>);
    return this;
  }

  sort() {
    const sortBy =
      (this.query.sort as string)?.split(',').join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this.query.fields as string)?.split(',').join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const filter = this.modelQuery.getFilter(); // Extract applied filter
    const total = await this.modelQuery.model.countDocuments(filter);

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
