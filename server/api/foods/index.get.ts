import { QueryOptions } from "mongoose";
import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";

export default defineEventHandler(async (event) => {
  // TODO: make a getUserId util
  const { userInfo } = await getUserSession(event);
  if (!userInfo)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  const user_id = userInfo.legacy_id || userInfo.sub;

  const searchParams = getQuery(event);

  // TODO use utils function for this?
  const {
    itemsPerPage = "5",
    page = "1",
    sort = "name",
    order = "asc",
    search,
    hidden,
    ...rest
  } = searchParams;

  if (typeof sort !== "string")
    throw createError({
      statusCode: 400,
      statusMessage: "'sort' must be string",
    });

  if (typeof order !== "string")
    throw createError({
      statusCode: 400,
      statusMessage: "'order' must be string",
    });

  if (!["asc", "desc"].includes(order))
    throw createError({
      statusCode: 400,
      statusMessage: "Order must be 'asc' or 'desc'",
    });

  const sortMap = {
    asc: 1,
    desc: -1,
  } as const;

  const skip = (Number(page) - 1) * Number(itemsPerPage);

  const query: QueryOptions = { user_id, ...rest };
  if (search && search !== "") query.name = { $regex: search, $options: "i" };

  const items = await Food.find(query)
    .sort({ [sort]: sortMap[order as "asc" | "desc"] })
    .skip(skip)
    .limit(Math.max(Number(itemsPerPage), 0));

  const total = await Food.countDocuments(query);

  // TODO: type cast before
  return {
    total,
    page: Number(page),
    itemsPerPage: Number(itemsPerPage),
    items,
    sort,
    order,
  };
});
