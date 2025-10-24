---
title: TIL - Episode 3. Mocking node modules.
date: "2019-10-31T07:00:00.000Z"
description: "In order to mock the node fs module with Jest, we need to make whats called a Manual Mock. https://github.com/echobind/eb-scripts/pull/8/files#diff-3dbad05e428063061d9a3a717674a5f1 The important thing to note is that this needs to exist alongside the..."
tags:
---


- In order to mock the node [fs](https://nodejs.org/api/fs.html) module with [Jest](https://jestjs.io/), we need to make whats called a [Manual Mock](https://jestjs.io/docs/en/manual-mocks.html).
  - [https://github.com/echobind/eb-scripts/pull/8/files#diff-3dbad05e428063061d9a3a717674a5f1](https://github.com/echobind/eb-scripts/pull/8/files#diff-3dbad05e428063061d9a3a717674a5f1)
    - The important thing to note is that this needs to exist alongside the `node_modules` directory

> If the module you are mocking is a Node module (e.g.: lodash), the mock should be placed in the **mocks** directory adjacent to node_modules
>
> -- <cite>[Mocking Node Modules](https://jestjs.io/docs/en/manual-mocks.html#mocking-node-modules), Jest Documentation</cite>

- Once you add the mock, the template for your test would look something like [this](https://github.com/echobind/eb-scripts/pull/8/files#diff-ac669a837ca1091fbd724061691f7c74)

```javascript
//  src/utils/my.test.ts

afterEach(() => {
  // reset your modules after each test
  jest.resetModules()
})

test("some test that requires the non-mocked node module", () => {
  jest.dontMock("fs")

  // add your test here
})

test("some test that mocks the fs module in order to test the expected outcome", () => {
  jest.mock("fs")

  // add your test here
})
```

- If you want to test out some global node object, such as process - you can do the following:

```javascript
test("some test that mocks the global process object", () => {
  jest.spyOn(process, "cwd").mockImplementation(() => "well..hello there!")

  // add your test here
})
```
