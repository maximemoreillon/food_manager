import type { FoodT } from "~~/server/models/food.schema";

export default function (food?: FoodT, thumbnail: boolean | undefined = false) {
  if (!food) return "";
  const { _id, image } = food;

  if (!image) return "/image-off.png";
  if (thumbnail) return `/api/foods/${_id}/image?thumbnail=yes`;
  else return `/api/foods/${_id}/image`;
}
