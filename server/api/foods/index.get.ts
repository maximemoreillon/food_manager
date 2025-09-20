import { QueryOptions } from "mongoose";
import { z } from "zod";
import { FoodT } from "~~/server/models/food.schema";

const querySchema = z.object({
  itemsPerPage: z.coerce.number().gt(0).lt(100).optional(),
  page: z.coerce.number().gt(0).optional(),
  sort: z.string().optional(),
  order: z.union([z.literal("asc"), z.literal("desc")]).optional(),
  search: z.string().optional(),
  hidden: z.coerce.boolean().default(false),
});

export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  const {
    itemsPerPage = 10,
    page = 1,
    sort = "name",
    order = "asc",
    search,
    hidden,
  } = await getValidatedQuery(event, querySchema.parse);

  const sortMap = {
    asc: 1,
    desc: -1,
  } as const;

  const skip = (page - 1) * itemsPerPage;

  const query: QueryOptions = { user_id };
  if (search && search !== "") query.name = { $regex: search, $options: "i" };
  if (!hidden) query.$or = [{ hidden: { $exists: false } }, { hidden: false }];

  const items = await Food.find(query)
    .sort({ [sort]: sortMap[order] })
    .skip(skip)
    .limit(itemsPerPage);

  const total = await Food.countDocuments(query);

  return {
    total,
    page,
    itemsPerPage,
    items,
    sort,
    order,
    hidden,
    search,
  };
});

// TODO: this should be inferred
export type FoodsFetchResponse = {
  page: number;
  itemsPerPage: number;
  sort: string;
  order: string;
  total: number;
  items: FoodT[];
  hidden?: boolean;
  search?: string;
};
