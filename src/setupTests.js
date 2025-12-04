import { expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./mocks/server";

expect.extend(matchers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
