import { describe, it } from 'vitest';
import * as index from "./index";

// The two tests marked with concurrent will be run in parallel
describe('suite', () => {
    it("sign", () => {
        const jwtPayload = {
            email: 'user1@example.com',
            name: 'JWT Taro',
        };
        const token = index.sign(jwtPayload)
        const decoded = index.decode(token)
        console.log(decoded)
    })

    it("decode", () => {
        const token = "eyJzdWIiOiJ5b3UiLCJhbGdvcml0aG0iOiJub25lIiwiZXhwIjoxNjYxMjIwOTg2ODExfQ==.e30=."
        const decoded = index.decode(token)
        console.log(decoded)
    })
})
