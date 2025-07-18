export default function (input: string | Date) {
  return new Date(input).toDateString();
}
