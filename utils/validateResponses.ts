import { Response } from "./postResponse";

export default function validateResponses(responses: Response[]) {
  return responses.some((item) => item.response.length === 0) ? false : true;
}
