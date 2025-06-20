import { QueryOptions } from "mongoose";
import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";
import { z } from "zod";

const querySchema = z.object({
  itemsPerPage: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.union([z.literal("asc"), z.literal("desc")]).optional(),
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
    sort = "name",
    order = "asc",
    search,
    // hidden,
    ...rest
  } = await getValidatedQuery(event, querySchema.parse);

  const sortMap = {
    asc: 1,
    desc: -1,
  } as const;

  const skip = page - 1 * itemsPerPage;

  const query: QueryOptions = { user_id, ...rest };
  if (search && search !== "") query.name = { $regex: search, $options: "i" };

  const items = await Food.find(query)
    .sort({ [sort]: sortMap[order] })
    .skip(skip)
    .limit(Math.max(Number(itemsPerPage), 0));

  const total = await Food.countDocuments(query);

  return {
    total,
    page,
    itemsPerPage,
    items,
    sort,
    order,
  };
});
