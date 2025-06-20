import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";
import { z } from "zod";

const querySchema = z.object({
  itemsPerPage: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.union([z.literal("asc"), z.literal("asc")]).optional(),
  search: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  // TODO: make a getUserId util
  const { userInfo } = await getUserSession(event);
  if (!userInfo)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  const user_id = userInfo.legacy_id || userInfo.sub;

  const {
    itemsPerPage = 5,
    page = 1,
    sort = "date",
    order = "desc",
    search,
    ...rest
  } = await getValidatedQuery(event, querySchema.parse);

  const sortMap = {
    asc: 1,
    desc: -1,
  } as const;

  const skip = (page - 1) * itemsPerPage;

  const query: any = { user_id, ...rest };
  if (search && search !== "") query.name = { $regex: search, $options: "i" };

  const items = await MealPlan.find(query)
    .skip(skip)
    .sort({ [sort]: sortMap[order] })
    .limit(Math.max(itemsPerPage, 0));

  const total = await MealPlan.countDocuments(query);

  // TODO: type cast before
  return {
    total,
    page,
    itemsPerPage,
    items,
    sort,
    order,
  };
});
