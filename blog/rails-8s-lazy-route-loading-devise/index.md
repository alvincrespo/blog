---
title: Rails 8's Lazy Route Loading + Devise
date: "2025-01-05T12:14:11.044Z"
description: "Rails 8.0 introduces a significant change to route loading behavior, lazy loading routes by default in development and test. This change has implications for gems that interact with Rails' routing system, particularly Devise, which I personally use o..."
tags:
---

Rails 8.0 introduces a significant change to [route loading behavior](https://github.com/rails/rails/pull/52012), lazy loading routes by default in development and test. This change has implications for gems that interact with Rails' routing system, particularly Devise, which I personally use on a couple of side projects. The issue in particular that I was running into was an error when running my tests that looked like this:

```plaintext
Error:
UserTest#test_find_by_or_new_returns_a_new_user_if_no_user_is_found:
RuntimeError: Could not find a valid mapping for #<User id: 986848094, email: "new.user@example.io", created_at: "2025-01-05 11:34:09.738943000 +0000", updated_at: "2025-01-05 11:34:09.738943000 +0000", role: "gardener", subscription_plan_id: nil, accepted_user_agreement: false, accepted_user_agreement_on: nil, stripe_id: nil, trial_started_at: nil, trial_ends_at: nil, deleted_at: nil, previous_email: nil, uuid: "a5826724-7509-416b-abd1-6e0a10302993">
    app/models/user.rb:83:in `find_by_or_new'
    test/models/user_test.rb:99:in `block in <class:UserTest>'
```

After doing some research, I found that this issue was related to the lazy loading route change in Rails 8. Let's check out how this change affects Devise and the potential impact it can have on any of your dependencies that hook into the Rails routing system.

## Understanding the Problem

### Rails 8's Lazy Route Loading

In Rails 8.0, routes are no longer eagerly loaded by default in development and test environments. This change aims to improve application boot time by loading routes only when they're needed. While this optimization is beneficial for most applications, it creates a challenge for dependencies that rely on route information being available during initialization.

### Devise's Route Dependency

Devise builds its mappings during the route loading phase. These mappings are crucial for Devise's functionality as they contain information about authenticated resources (like User, Admin, etc.) and their corresponding routes. Previously, Devise stored these mappings in a class variable accessed through a simple `mattr_reader`:

```ruby
# https://github.com/heartcombo/devise/blob/v4.9.4/lib/devise.rb
  
# Store scopes mappings.
mattr_reader :mappings
@@mappings = {}

def self.add_mapping(resource, options)
  mapping = Devise::Mapping.new(resource, options)
  @@mappings[mapping.name] = mapping
  @@default_scope ||= mapping.name
  @@helpers.each { |h| h.define_helpers(mapping) }
  mapping
end
```

```ruby
# https://github.com/heartcombo/devise/blob/v4.9.4/lib/devise/rails/routes.rb

def devise_for(*resources)
  # ...
  resources.each do |resource|
    mapping = Devise.add_mapping(resource, options)
```

This worked fine when routes were eagerly loaded, but with Rails 8's lazy loading, the mappings might not be available when they're first accessed.

## The Solution

The fix involves modifying how Devise accesses its mappings. Instead of using a simple `mattr_reader`, the solution implements a custom getter method that ensures routes are loaded before accessing the mappings:

```ruby
def self.mappings
  Rails.application.try(:reload_routes_unless_loaded)
  @@mappings
end
```

***Jerome Dalbert*** *at* [*https://github.com/heartcombo/devise/issues/5705*](https://github.com/heartcombo/devise/issues/5705)

### How It Works

1. When the `mappings` method is called, it first checks if routes need to be loaded
    
2. `reload_routes_unless_loaded` is called on the Rails application, which:
    
    * Checks if routes are already loaded
        
    * Loads them if necessary
        
    * Does nothing if they're already available
        
3. Only then does it return the mappings stored in the class variable
    

The `reload_routes_unless_loaded` method is new in Rails 8, introduced in [https://github.com/rails/rails/pull/52012](https://github.com/rails/rails/pull/52012):  

```ruby
# railties/lib/rails/application.rb

def reload_routes_unless_loaded # :nodoc:
  initialized? && routes_reloader.execute_unless_loaded
end 
```

Which in turn calls the `execute_unless_loaded` method on the `RoutesReloader` instance:

```ruby
# railties/lib/rails/application/routes_reloader.rb

def initialize
  @paths      = []
  @route_sets = []
  @external_routes = []
  @eager_load = false
  @loaded = false
end

# ...

def execute_unless_loaded
  unless @loaded
    execute
    ActiveSupport.run_load_hooks(:after_routes_loaded, Rails.application)
    true
  end
end
```

This helps with application boot performance for applications with large amounts of routes that don’t need to be loaded all at once. The tradeoff here is that dependencies need to take into account this new strategy if they depend on rails routing being entirely loaded at the start.

### Implementation Details

By using `try(:reload_routes_unless_loaded)`, it:

* Maintains backward compatibility with older Rails versions that don't have this method
    
* Handles the route loading only when necessary
    
* Ensures that Devise's mappings are always available when needed
    

## Short term solution

For those who need an immediate solution while waiting for an official Devise update, a temporary fix can be implemented via an initializer:

```ruby
# config/initializers/devise_rails8_patch.rb

require 'devise'
Devise # make sure it's already loaded

module Devise
  def self.mappings
    Rails.application.try(:reload_routes_unless_loaded)
    @@mappings
  end
end
```

***Jonathan Rochkind*** *at* [*https://github.com/heartcombo/devise/pull/5728#issuecomment-2539418211*](https://github.com/heartcombo/devise/pull/5728#issuecomment-2539418211)

You can also implement this in your `test_helper.rb`, by adding this to the end of the file:

```ruby
ActiveSupport.on_load(:action_mailer) do
  Rails.application.reload_routes_unless_loaded
end
```

***Matt Brictson*** *at* [*https://github.com/heartcombo/devise/issues/5705#issuecomment-2442370072*](https://github.com/heartcombo/devise/issues/5705#issuecomment-2442370072)

## Impact and Best Practices

This change highlights important considerations for gem maintainers and Rails developers:

1. **Initialization Order**: Be mindful of when your code needs access to routes and other Rails components
    
2. **Lazy Loading Compatibility**: Consider how your gem or application might be affected by lazy loading in Rails 8
    
3. **Backward Compatibility**: Ensure solutions work across different Rails versions when possible
    

## Conclusion

This change in Rails 8 directly impacts dependencies that rely on how routing works by eager loading routes when they are used. Devise 4.x currently has an issue with this strategy that is incompatible with Rails 8, specifically when running tests. The fix above has been merged in the main branch of Devise, but the short term solutions above help provide an immediate workaround.

It's a reminder of the importance of understanding the frameworks we build upon and their lifecycle events. For Rails developers upgrading to Rails 8.0, being aware of these changes and their implications will help ensure a smooth transition, especially when using gems that interact deeply with Rails' routing system.

---

## References

[Defer route drawing to the first request, or when url\_helpers called. #52012 (retry)](https://github.com/rails/rails/pull/52012)

[Defer route drawing to the first request, or when url\_helpers called #51614 (reverted)](https://github.com/rails/rails/pull/51614)

[Make Devise.mappings work with lazy loaded routes.](https://github.com/heartcombo/devise/pull/5728)

[Test helpers don't work on the Rails main branch (8.0.0.alpha)](https://github.com/heartcombo/devise/issues/5694)