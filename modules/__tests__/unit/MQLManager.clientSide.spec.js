import { MQLManager } from "../../index";
import { queries, mockMatchMedia } from "../testUtils";

let onChangeSpy;
let testMQLManager;
let debounce = 100;

describe("MQLManager client-side", () => {
  beforeAll(() => {
    window.matchMedia = mockMatchMedia;

    onChangeSpy = jest.fn(matchState => matchState);
    testMQLManager = new MQLManager({
      queries,
      onChange: onChangeSpy,
      debounce
    });
  });

  it("should internally construct Media Query Lists", () => {
    Object.keys(queries).forEach(key =>
      expect(testMQLManager.MQLs).toHaveProperty(key)
    );
  });

  test("should debounce calls to onChange", done => {
    testMQLManager._broadcastState();
    testMQLManager._broadcastState();
    testMQLManager._broadcastState();
    // expect one call to onChangeSpy from init,
    // 1 more after debouncing above three calls:
    expect(onChangeSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      done();
    }, debounce + 100);
  });

  it(`should error if an MQL's media prop === "not all", as its query is incorrectly written.`, function() {
    this.badMQL = { media: "not all" };

    expect(() =>
      MQLManager.validateMQLMedia(this.badMQL, "faultyQueryName")
    ).toThrowError(/ignored/);
  });

  it(`should error if onChange arg is null or not a function`, () => {
    expect(
      () =>
        new MQLManager({
          queries,
          onChange: null,
          debounce: 0
        })
    ).toThrowError(/onChange function/);

    expect(
      () =>
        new MQLManager({
          queries,
          onChange: 10,
          debounce: 0
        })
    ).toThrowError(/onChange function/);
  });

  it(`should error if queries arg is null or not an object`, () => {
    expect(
      () =>
        new MQLManager({
          queries: null,
          onChange: onChangeSpy,
          debounce: 0
        })
    ).toThrowError();

    expect(
      () =>
        new MQLManager({
          queries: () => {},
          onChange: onChangeSpy,
          debounce: 0
        })
    ).toThrowError();
  });

  it(`should error if queries argument's values are not strings`, () => {
    expect(
      () =>
        new MQLManager({
          queries: { one: 1 },
          onChange: onChangeSpy,
          debounce
        })
    ).toThrowError(/query strings/);
  });

  it(`should error if debounce arg is present and not a number`, () => {
    expect(
      () =>
        new MQLManager({
          queries,
          onChange: onChangeSpy,
          debounce: "hi"
        })
    ).toThrowError(/Debounce/);
  });
});
