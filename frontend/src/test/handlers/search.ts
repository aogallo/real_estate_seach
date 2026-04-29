import { http, HttpResponse } from "msw"
import { mockEmptyResponse, mockSearchResponse } from "../fixtures/property"

export const searchHandlers = [
  http.post("http://localhost:8000/search", async ({ request }) => {
    const body = (await request.json()) as { query: string }
    return HttpResponse.json(
      body.query === "empty" ? mockEmptyResponse : mockSearchResponse,
    )
  }),
]
