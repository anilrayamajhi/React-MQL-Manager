/**
 * @jest-environment node
 */

import { MQLManager } from "../../index";
import { queries } from "../testUtils";

let onChangeSpy;
let testMQLManager;
let debounce = 100;

describe(`MQLManager server-side`, () => {
  beforeAll(() => {
    onChangeSpy = jest.fn(matchState => matchState);

    testMQLManager = new MQLManager({
      queries,
      onChange: onChangeSpy,
      debounce,
      serverMatches: [queries.M, queries.L]
    });
  });

  test(`should return an object of matches matching queries specified in serverMatches prop`, () => {
    expect(testMQLManager.getMatchState()).toMatchObject({
      S: false,
      M: true,
      L: true
    });
  });

  test(`should return an object of matches with true values if serverMatches is not specified`, () => {
    let noServerMatches = new MQLManager({
      queries,
      onChange: onChangeSpy,
      debounce
    });
    expect(noServerMatches.getMatchState()).toMatchObject({
      S: true,
      M: true,
      L: true
    });
  });
});
