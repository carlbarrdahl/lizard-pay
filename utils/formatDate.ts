import dayjs from "dayjs";

export function formatDate(d: number | string, template = "MMMM DD YYYY") {
  return dayjs(d).format(template);
}
