import { QueryOptions } from "mongoose";
import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";

export default defineEventHandler(async (event) => {
  // TODO: make a getUserId util
  const { userInfo } = await getUserSession(event);
  if (!userInfo)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  const user_id = userInfo.legacy_id || userInfo.sub;

  // TODO: typing as {string: string}
  const {
    itemsPerPage = "5",
    page = "1",
    sort = "name",
    order = "asc",
    search,
    hidden = false,
    ...rest
  }: any = getQuery(event);

  if (order !== "asc" && order !== "desc")
    throw createError({ statusCode: 400, statusMessage: "Invalid order" });

  const sortMap = {
    asc: 1,
    desc: -1,
  };

  const skip = (Number(page) - 1) * Number(itemsPerPage);

  const query: QueryOptions = { user_id, ...rest };
  if (search && search !== "") query.name = { $regex: search, $options: "i" };

  const items = await Food.find(query)
    .sort({ [sort]: sortMap[order] })
    .skip(skip)
    .limit(Math.max(Number(itemsPerPage), 0));

  const total = await Food.countDocuments(query);

  // TODO: page and itemsPerPage are string
  return { total, page, itemsPerPage, items, sort, order };
});
