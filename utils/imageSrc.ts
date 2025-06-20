export default function (_id?: string, thumbnail: boolean | undefined = false) {
  if (!_id) return "";
  if (thumbnail) return `/api/foods/${_id}/image?thumbnail=yes`;
  else return `/api/foods/${_id}/image`;
}
