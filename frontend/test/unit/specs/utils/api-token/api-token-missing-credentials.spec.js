import { describe, expect, it } from "vitest"

import { getApiAccessToken } from "~/plugins/01.api-token.server"

describe("missing client credentials", () => {
  describe("completely missing", () => {
    // https://github.com/wordpress/openverse/issues/5171
    it.skip("should not make any requests and fall back to tokenless", async () => {
      const token = await getApiAccessToken()

      expect(token).toEqual(undefined)
    })
  })

  describe("explicitly undefined", () => {
    // https://github.com/wordpress/openverse/issues/5171
    it.skip("should not make any requests and fall back to tokenless", async () => {
      const accessToken = await getApiAccessToken({
        apiClientId: undefined,
        apiClientSecret: undefined,
      })
      expect(accessToken).toEqual(undefined)
    })
  })
})
