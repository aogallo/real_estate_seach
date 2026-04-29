import { setupServer } from "msw/node"
import { searchHandlers } from "./handlers/search"

export const server = setupServer(...searchHandlers)
