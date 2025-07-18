import { z } from "zod";
import { MealPlanT } from "~/server/models/mealPlan.schema";
import getUserId from "~/server/utils/getUserId";

const querySchema = z.object({
  itemsPerPage: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.union([z.literal("asc"), z.literal("desc")]).optional(),
  search: z.string().optional(),
  to: z.coerce.date().optional(),
  from: z.coerce.date().optional(),
});

export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  const {
    itemsPerPage = 10,
    page = 1,
    sort = "date",
    order = "desc",
    search,
    to,
    from,
    ...rest
  } = await getValidatedQuery(event, querySchema.parse);

  const sortMap = {
    asc: 1,
    desc: -1,
  } as const;

  const skip = (page - 1) * itemsPerPage;

  const query: any = { user_id, ...rest };
  if (search && search !== "") query.name = { $regex: search, $options: "i" };

  if (to || from) {
    query.date = {};
    if (to) query.date.$lt = to;
    if (from) query.date.$gt = from;
  }

  const items = await MealPlan.find(query)
    .skip(skip)
    .sort({ [sort]: sortMap[order] })
    .limit(Math.max(itemsPerPage, 0));

  const total = await MealPlan.countDocuments(query);

  return {
    items: items.map((i) => i.toObject({ virtuals: true })),
    total,
    page,
    itemsPerPage,
    sort,
    order,
  };
});

export type MealPlansResponse = {
  sort: string;
  order: string;
  page: number;
  itemsPerPage: number;
  items: MealPlanT[];
  total: number;
};
