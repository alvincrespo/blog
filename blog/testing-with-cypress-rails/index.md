---
title: Testing with Cypress + Rails
date: "2020-05-13T16:00:00.000Z"
description: "Testing is necessary. I want to be confident that changes do not introduce unexpected side effects. This is how I want to feel:  How do we develop that confidence? Tests. Good tests, maybe even great tests! Luckily, we have great technology at our fi..."
tags:
---

Testing is necessary. I want to be confident that changes do not introduce unexpected side effects. This is how I want to feel:

![](https://i.giphy.com/BilBnxavZVjFBbVWwp.webp)

How do we develop that confidence? Tests. Good tests, maybe even great tests!

Luckily, we have great technology at our fingertips to accomplish this: [Rails](https://rubyonrails.org/) and [Cypress](https://www.cypress.io/). Along with [`cypress-on-rails`](https://github.com/shakacode/cypress-on-rails) we can develop end-to-end tests that cover critical parts of our application - building the trust we need to iterate faster and efficiently without breaking stuff.

# **A Modest Test of Strength**

Let’s start with a sample passing test:

```javascript
describe("Authentication", function () {
  beforeEach(() => {
    cy.app("clean");
  });

  describe("admin", () => {
    it("can login", () => {
      cy.appScenario("admin");cy.visit("/admins/login");cy.get('input[type="email"]').type("bruce.wayne@wayneenterprises.com");
      cy.get('input[type="password"]').type("iambatman");cy.get('input[type="submit"]').click();cy.url().should("contain", "admin");
      cy.contains("Welcome to the Admin Dashboard").should("exist");
    });
  });
});
```

This test essentially makes sure that we can log in as an admin. A few things to note:

* We “clean” our app before each test (wipe the database, remove temp files, etc…)
    
* A scenario is set up for the test with `cy.appScenario("admin")`
    
* Bruce Wayne really shouldn’t use his superhero name as a password
    

# **How Does This Work? Tell me!**

The test is pretty basic, but how does it work with Rails? That’s where `cypress-on-rails` comes in. This nifty gem essentially executes commands against your test server so that your tests actually run a working app. Ok, what does that mean?

It means we do the following:

* Start a test server (`rails s -e test -p 5017` )
    
* Start Cypress
    
* Run our tests
    

When starting cypress, using `cypress-on-rails`, it is configured to hit `http://localhost:5017` the host and port we're running the test server on. How does this work behind the scenes? There are a few things happening:

**Custom** `cy` **Commands are Created for Us**

```javascript
// spec/cypress/support/on-rails.js
Cypress.Commands.add('appCommands', function (body) {
  cy.log("APP: " + JSON.stringify(body))
  return cy.request({
    method: 'POST',
    url: "/__cypress__/command",
    body: JSON.stringify(body),
    log: true,
    failOnStatusCode: true
  }).then((response) => {
    return response.body
  });
});

Cypress.Commands.add('app', function (name, command_options) {
  return cy.appCommands({name: name, options: command_options}).then((body) => {
    return body[0]
  });
});
```

  

Remember the “clean” line of code above, `cy.app("clean");` ? Well, `cy` is extended with an `app` command that in turn calls `appCommands` . The `appCommands` command makes an HTTP request to `http://localhost:5017/__cypress__/command` - where our command is evaluated.

NOTE: Want to know more about how `/__cypress__/command` is added to your Rails app? Check out [this line of code](https://github.com/shakacode/cypress-on-rails/blob/master/lib/cypress_on_rails/middleware.rb#L15-L22).

**Evaluating Ruby Code**

So when `cy.app("clean")` is called, we make a request, and then what happens? Well, we evaluate some Ruby code.

```ruby
# spec/cypress/app_commands/clean.rb
if defined?(DatabaseCleaner)
  # cleaning the database using database_cleaner
  DatabaseCleaner.strategy = :truncation
  DatabaseCleaner.clean
else
  logger.warn 'add database_cleaner or update cypress/app_commands/clean.rb'
  Post.delete_all if defined?(Post)
end

Rails.logger.info 'APPCLEANED' # used by log_fail.rb
```

NOTE: Want to know more about how your command gets evaluated? Check out [this line of code](https://github.com/shakacode/cypress-on-rails/blob/master/lib/cypress_on_rails/command_executor.rb#L9).

# **A Moderate Test of Strength**

So, ok — you know the basics of how `cypress-on-rails` gives you the ability to do true end-to-end tests. So what? I'll tell you what, now you can confidently test out dates!

```ruby
describe("Dashboard", function () {
  beforeEach(() => {
    cy.app("clean");cy.appScenario("admin");cy.login(
      "bruce.wayne@wayneenterprises.com",
      "iambatman"
    );
  });

  it("displays welcome message", async () => {
    cy.app("time_now").then((formattedDate) => {
      cy.get(".cy-currentdate").should("contain", formattedDate);
    });
  });
});
```

This looks simple, right? Well, it is now!

Let’s look at the `cy.app("time_now")` command:

```ruby
# spec/cypress/app_commands/time_now.rb
Time.now.strftime('%A %B %-d, %Y')
```

What does this file return? A DateTime formatted as `Monday April 27, 2020`.

Why is this useful? Because you can now write an end to end test that renders the correct date that is rendered on the server. You don’t have to mess with JavaScript dates in your Cypress test and then fall into the pitfall of inconsistencies between your test and app.

# **Wrap It Up!**

Shipping apps confidently is an important aspect of building trust. Cypress enables us to test against the most critical pieces of our application by actually running our tests in a fast and reliable browser environment. With `cypress-on-rails` we can ensure our Rails apps work the way we expect them too with little to no risk.

Try it out! Your team will thank you.