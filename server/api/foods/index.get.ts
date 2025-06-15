import { QueryOptions } from "mongoose";
import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";

export default defineEventHandler(async (event) => {
  const { userInfo } = await getUserSession(event);
  if (!userInfo)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  const user_id = userInfo.legacy_id || userInfo.sub;

  const {
    skip = "0",
    limit = "50",
    sort = "name",
    order = "1",
    search,
    hidden = false,
    ...rest
  }: any = getQuery(event);

  // TODO: user_id

  let query: QueryOptions = { user_id, ...rest };
  // if (search && search !== "") query.name = { $regex: search, $options: "i" };
  try {
    const items = await Food.find(query)
      // .sort({ [sort]: order })
      .skip(Number(skip))
      .limit(Math.max(Number(limit), 0));

    const total = await Food.countDocuments(query);

    return { total, skip, limit, items };
  } catch (error) {
    console.error(error);
    return error;
  }
});
